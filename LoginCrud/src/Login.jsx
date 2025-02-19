import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Login() {
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", {
            email: email,
            password: password,
        }).then((response) => {
            console.log(response)
            if(response.data === "Login Success"){
                navigate("/home");
            }
            
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 " >
            <div className="bg-white p-3 rounded w-25"> 
                <h2>
                    Login Form
                </h2>
                <form onSubmit = {handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="Enter Email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="Enter Password" />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0" > Login </button>
                    <Link to="/" className=" btn btn-default border w-100 bg-light rounded-0 "> Register </Link>
                    <p> Don't have an account ?  </p>
                </form>
            </div>
        </div>
    );

}
export default Login;