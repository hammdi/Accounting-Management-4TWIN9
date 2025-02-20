import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function UpdateUser() {
    const{id} = useParams();
    const [name, setName] = useState([]);
    const [email, setEmail]= useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get("http://localhost:3001/getUser/"+id)
            .then(response => {
                console.log(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setPassword(response.data.password);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100 " >
            <div className="bg-white p-3 rounded w-50">
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" value={name} onChange={(e)=> setName (e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e)=> setEmail() (e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e)=> setPassword() (e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;