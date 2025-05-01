const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const logger = require('../utils/logger'); // <== Ajout de Winston

exports.registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const userExist = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExist) {
            logger.warn(`Tentative d'inscription avec email ou téléphone existant : ${email}, ${phone}`);
            return res.status(400).json({ message: 'Email ou téléphone déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = new User({
            name, email, password: hashedPassword, phone,
            status: 'Inactive', role: 'user', verificationToken,
        });

        await user.save();
        await sendVerificationEmail(user.email, verificationToken);
        logger.info(`Nouvel utilisateur enregistré : ${email}`);
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de l'inscription : ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "hamdikbaier8@gmail.com",
            pass: "stti hxpu emue ouph",
        },
    });

    const verificationLink = `http://localhost:5000/api/users/verify/${token}`;

    const mailOptions = {
        from: "hamdikbaier8@gmail.com",
        to: email,
        subject: "Account Verification",
        text: `Click on this link to activate your account: ${verificationLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email de vérification envoyé à : ${email}`);
    } catch (error) {
        logger.error(`Erreur lors de l'envoi de l'email : ${error.message}`);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Connexion échouée : utilisateur non trouvé (${email})`);
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (user.status === "Inactive") {
            logger.warn(`Connexion échouée : compte inactif (${email})`);
            return res.status(400).json({ message: 'activation required' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Connexion échouée : mot de passe incorrect (${email})`);
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info(`Connexion réussie pour l'utilisateur : ${email}`);
        res.status(200).json({ message: 'Connexion réussie', token, user });
    } catch (error) {
        logger.error(`Erreur lors de la connexion : ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            logger.warn(`Utilisateur introuvable avec ID : ${req.params.id}`);
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        logger.info(`Utilisateur récupéré avec succès : ${req.params.id}`);
        res.status(200).json(user);
    } catch (error) {
        logger.error(`Erreur serveur lors de la récupération de l'utilisateur : ${error.message}`);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email, password, role, phone, status, avatar } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            logger.warn(`Mise à jour échouée : utilisateur non trouvé (${req.params.id})`);
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        let updatedPassword = user.password;
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = updatedPassword;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.status = status || user.status;

        if (avatar) {
            const buffer = Buffer.from(avatar, 'base64');
            user.avatar = buffer;
        }

        await user.save();
        logger.info(`Utilisateur mis à jour avec succès : ${user._id}`);
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        logger.error(`Erreur serveur lors de la mise à jour : ${error.message}`);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            logger.warn(`Suppression échouée : utilisateur non trouvé (${req.params.id})`);
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        logger.info(`Utilisateur supprimé : ${req.params.id}`);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de l'utilisateur : ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        logger.info(`Liste de tous les utilisateurs récupérée (${users.length} utilisateurs)`);
        res.status(200).json(users);
    } catch (error) {
        logger.error(`Erreur serveur lors de la récupération des utilisateurs : ${error.message}`);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Réinitialisation du mot de passe échouée : utilisateur non trouvé (${email})`);
            return res.status(404).json({ message: "User not found" });
        }

        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your New Password",
            text: `Your new password is: ${newPassword}\nPlease log in and change it immediately.`,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Mot de passe réinitialisé et envoyé à : ${email}`);
        res.status(200).json({ message: "A new password has been sent to your email." });
    } catch (error) {
        logger.error(`Erreur lors de la réinitialisation du mot de passe : ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { password } = req.body;

        if (!password) {
            logger.warn("Mise à jour du mot de passe échouée : mot de passe manquant");
            return res.status(400).json({ message: "Le mot de passe est requis." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        logger.info(`Mot de passe mis à jour avec succès pour l'utilisateur : ${userId}`);
        res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
    } catch (error) {
        logger.error(`Erreur lors de la mise à jour du mot de passe : ${error.message}`);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

const generateRandomPassword = (length = 10) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

