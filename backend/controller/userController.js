const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Inscription de l'utilisateur (Register User)
exports.registerUser = async (req, res) => {
    const { name, email, password, phone, status } = req.body;
    try {// Vérifier si l'email ou le téléphone existe déjà
        const userExist = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExist) {return res.status(400).json({ message: 'Email ou téléphone déjà utilisé' });}
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        // Créer un nouvel utilisateur
        const user = new User({
            name, email, password: hashedPassword, phone, status: 'Inactive', role: 'user',verificationToken,});
        await user.save();
        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Function to send verification email
const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // You can use another email provider (e.g., Outlook, Yahoo)
        auth: {
            user: "hamdikbaier8@gmail.com", // Change to your email
            pass: "stti hxpu emue ouph", // Change to your email password (Use App Passwords for security)
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
        console.log("Verification email sent!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Connexion de l'utilisateur (Login User)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        if(user.status=="Inactive") return res.status(400).json({ message: 'activation required'})
        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }
        // Créer un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Connexion réussie',
            token,user
            /*user: {
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                status: user.status
            }*/
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un utilisateur par ID (Get a user by ID)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password for security
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un utilisateur (Update user details)
exports.updateUser = async (req, res) => {
    const { name, email, password, role, phone, status } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // If password is provided, hash it
        let updatedPassword = user.password;
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = updatedPassword;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.status = status || user.status;


  // Mise à jour de l'avatar si fourni (conversion base64 -> Buffer)
  if (avatar) {
    const buffer = Buffer.from(avatar, 'base64');
    user.avatar = buffer;
}





        await user.save();
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un utilisateur (Delete a user)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les utilisateurs (Get all users)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new random password
        const newPassword = generateRandomPassword();

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Send email with the new password
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables for security
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
        res.status(200).json({ message: "A new password has been sent to your email." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};
