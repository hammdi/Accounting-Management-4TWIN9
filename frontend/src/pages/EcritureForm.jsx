import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MasterLayout from '../masterLayout/MasterLayout';

const EcritureForm = () => {
    const [form, setForm] = useState({
        description: '',
        compteDebit: '',
        compteCredit: '',
        montant: '',
        reference: '',
        journalCode: 'OD'
    });

    const [comptes, setComptes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/comptes')
            .then(res => {
                console.log("✅ Comptes chargés :", res.data);
                setComptes(res.data);
            })
            .catch(err => console.error("❌ Erreur chargement comptes :", err));
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitEcriture = async () => {
        try {
            await axios.post('http://localhost:5000/api/ecritures', {
                ...form,
                montant: parseFloat(form.montant)
            });
            alert("✅ Écriture enregistrée !");
            setForm({ description: '', compteDebit: '', compteCredit: '', montant: '', reference: '', journalCode: 'OD' });
        } catch (err) {
            console.error(err);
            alert("❌ Erreur lors de l'enregistrement");
        }
    };

    return (
        <MasterLayout>
            <div className="col-lg-8 mx-auto mt-4">
                <h3>Nouvelle Écriture Comptable</h3>
                <div className="card p-4">
                    <div className="form-group mb-2">
                        <label>Description</label>
                        <input name="description" className="form-control" value={form.description} onChange={handleChange} />
                    </div>

                    <div className="form-group mb-2">
                        <label>Compte Débit</label>
                        <select name="compteDebit" className="form-control" value={form.compteDebit} onChange={handleChange}>
                            <option value="">-- Sélectionner --</option>
                            {comptes.map(c => (
                                <option key={c._id} value={c._id}>{c.numero} - {c.libelle}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Compte Crédit</label>
                        <select name="compteCredit" className="form-control" value={form.compteCredit} onChange={handleChange}>
                            <option value="">-- Sélectionner --</option>
                            {comptes.map(c => (
                                <option key={c._id} value={c._id}>{c.numero} - {c.libelle}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Montant</label>
                        <input name="montant" type="number" className="form-control" value={form.montant} onChange={handleChange} />
                    </div>

                    <div className="form-group mb-3">
                        <label>Référence</label>
                        <input name="reference" className="form-control" value={form.reference} onChange={handleChange} />
                    </div>

                    <button onClick={submitEcriture} className="btn btn-success">Enregistrer</button>
                </div>
            </div>
        </MasterLayout>
    );
};

export default EcritureForm;
