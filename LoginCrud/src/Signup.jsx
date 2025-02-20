import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OAuth from "./OAuth.jsx";

function Signup() {
const [name, setName] = useState("");   
const [email, setEmail]= useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();


const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/register", {
        name: name,
        email: email,
        password: password,
    }).then((response) => {
        console.log(response) 
        navigate("/login");
    })
    .catch((error) => {
        console.log(error);
    });
};

    return (
     
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 " >
            <div className="bg-white p-3 rounded w-25"> 
                <h2>
                    Register Form
                </h2>
                <form onSubmit = {handleSubmit}> 
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" placeholder="Enter Name" onChange={(e)=> setName (e.target.value)}  />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="Enter Email" onChange={(e)=> setEmail (e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="Enter Password" onChange={(e)=> setPassword (e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-success w-100 rounded-0" > Register </button>
                    
                    
                    <Link to="/login" className=" btn btn-default border w-100 bg-light rounded-0 "> Login </Link>
                    <OAuth />
                    <p> Already have an account ?  </p>
                </form>

            </div>
        </div>
    );

}

export default Signup;