import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BilanList = () => {
    const [bilans, setBilans] = useState([]);

    useEffect(() => {
        axios.get('/api/bilans')
            .then(res => setBilans(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h3>Liste des Bilans Comptables</h3>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Période</th>
                    <th>Total Actif</th>
                    <th>Total Passif</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {bilans.map(bilan => (
                    <tr key={bilan._id}>
                        <td>{new Date(bilan.dateBilan).toLocaleDateString()}</td>
                        <td>{bilan.periode}</td>
                        <td>{bilan.totalActif}</td>
                        <td>{bilan.totalPassif}</td>
                        <td>{bilan.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BilanList;
