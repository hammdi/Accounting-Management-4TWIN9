import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MasterLayout from '../masterLayout/MasterLayout';

const JournalPage = () => {
    const [ecritures, setEcritures] = useState([]);
    const fileInput = useRef(null);

    useEffect(() => {
        fetchEcritures();
    }, []);

    const fetchEcritures = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/ecritures');
            setEcritures(res.data);
        } catch (err) {
            console.error("❌ Erreur chargement écritures :", err);
        }
    };

    const importExcel = async () => {
        const file = fileInput.current.files[0];
        if (!file) {
            alert("❌ Veuillez sélectionner un fichier Excel");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/api/ecritures/import/excel", formData);
            alert(`✅ ${res.data.count} écritures importées avec succès`);
            fetchEcritures(); // recharger après import
        } catch (err) {
            alert("❌ Échec de l'import");
            console.error(err);
        }
    };

    return (
        <MasterLayout>
            <div className="col-lg-10 mx-auto mt-4">
                <h3> Journal Comptable</h3>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-2">
                        <input type="file" ref={fileInput} accept=".xlsx" className="form-control" />
                        <button className="btn btn-outline-success" onClick={importExcel}> Importer Excel</button>
                    </div>
                    <a href="http://localhost:5000/api/ecritures/export/excel" className="btn btn-outline-primary">
                         Exporter en Excel
                    </a>
                </div>

                <div className="table-responsive card p-3">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Débit</th>
                            <th>Crédit</th>
                            <th>Montant</th>
                            <th>Référence</th>
                            <th>Journal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ecritures.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-muted">Aucune écriture disponible</td>
                            </tr>
                        ) : (
                            ecritures.map((e) => (
                                <tr key={e._id}>
                                    <td>{new Date(e.dateEcriture || e.createdAt).toLocaleDateString()}</td>
                                    <td>{e.description}</td>
                                    <td>{e.compteDebit?.numero} - {e.compteDebit?.libelle}</td>
                                    <td>{e.compteCredit?.numero} - {e.compteCredit?.libelle}</td>
                                    <td>{e.montant?.toFixed(2)} TND</td>
                                    <td>{e.reference || "-"}</td>
                                    <td>{e.journalCode}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MasterLayout>
    );
};

export default JournalPage;
