import React, { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


function Users() {

    const [users, setUsers] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:3001/users")
            .then(response =>setUsers(response.data))
            .catch(err => console.log(err));
    }, []);




    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100 " >
            <div className="bg-white p-3 rounded w-50">
                <table className="table">  
                    <thead>
                        <tr>
                            
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {users.map((user, index) => (
                            <tr key={index}>
                            
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link to="/update" className="btn btn-primary mx-2">Edit</Link>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                       
                </table>

            </div>
           
        </div>
    );
}

export default Users;