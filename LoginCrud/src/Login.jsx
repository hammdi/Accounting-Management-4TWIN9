import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "./firebase.js"; // Assure-toi que le fichier firebase.js est bien configuré
import Button from "react-bootstrap/Button";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(app);

    // ✅ Fonction pour la connexion normale (email/mot de passe)
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", {
            email: email,
            password: password,
        }).then((response) => {
            console.log(response);
            if (response.data === "Login Success") {
                navigate("/home");
            } else {
                alert("Invalid credentials");
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    // ✅ Fonction pour la connexion avec Google
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            console.log(resultsFromGoogle);

            const res = await fetch("http://localhost:3001/login/google", { // ✅ Requête au backend
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: resultsFromGoogle.user.email,
                }),
            });

            const data = await res.json();
            console.log("Backend response:", data);

            if (data.message === "Login Success") {
                navigate("/home"); // ✅ Redirection après connexion
            } else {
                alert("User not found, please register first.");
            }
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Login Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Login</button>
                    <Button variant="danger" className="w-100 mt-2" onClick={handleGoogleLogin}>
                        Sign in with Google
                    </Button>
                    <Link to="/" className="btn btn-default border w-100 bg-light rounded-0 mt-2">Register</Link>
                    <p>Don't have an account?</p>
                </form>
            </div>
        </div>
    );
}

export default Login;
