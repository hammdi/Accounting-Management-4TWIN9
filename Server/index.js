const express = require('express');
const mongoose = require('mongoose');
const cors =require('cors');
const User = require('./model/User');

const app = express();  
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/User');

app.post('/register', (req, res) => { 
    User.create(req.body).then(User => res.json(User)).catch(err => res.json(err));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email, password }).then(User => {
        if(User){
            res.json("Login Success");
        } else {
            res.json("Invalid email or password");
        }
    }).catch(err => res.json(err));
});

app.get('/users', (req, res) => {
    User.find().then(User => res.json(User)).catch(err => res.json(err));
})

app. get('/getUser/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id).then(User => res.json(User)).catch(err => res.json(err));
});
app.post('/auth/google', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });

        if (!user) {
            // Si l'utilisateur n'existe pas, on l'ajoute à la base de données
            user = await User.create({ name, email, password: "google_auth" });
        }

        res.json({ message: "User authenticated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.post('/login/google', async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found, please register first." });
        }

        res.json({ message: "Login Success", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
