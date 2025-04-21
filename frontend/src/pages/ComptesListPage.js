import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComptesListPage = () => {
    const [comptes, setComptes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/comptes')
            .then(res => setComptes(res.data))
            .catch(err => console.error("❌ Error fetching comptes:", err));
    }, []);

    return (
        <div className="container mt-4">
            <h2>📘 Plan Comptable</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                <tr>
                    <th>Num</th>
                    <th>Libellé</th>
                    <th>Niveau</th>
                </tr>
                </thead>
                <tbody>
                {comptes.map(compte => (
                    <tr key={compte._id}>
                        <td>{compte.Num}</td>
                        <td>{compte.Libelle}</td>
                        <td>{compte.Level}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComptesListPage;
