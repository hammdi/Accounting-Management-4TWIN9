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
        <div className="col-lg-10 mx-auto">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">📘 Plan Comptable</h5>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table basic-table mb-0">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Numéro</th>
                                <th>Libellé</th>
                                <th>Niveau</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comptes.map((compte, index) => (
                                <tr key={compte._id}>
                                    <td>{index + 1}</td>
                                    <td>{compte.Num}</td>
                                    <td>{compte.Libelle}</td>
                                    <td>{compte.Level}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ComptesListPage;
