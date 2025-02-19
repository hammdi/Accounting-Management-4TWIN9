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

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
