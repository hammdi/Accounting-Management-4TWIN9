import React, { useState } from 'react';
import axios from 'axios';

const BilanForm = () => {
    const [form, setForm] = useState({
        dateBilan: '',
        actifNonCourant: 0,
        actifCourant: 0,
        passifNonCourant: 0,
        passifCourant: 0,
        capitauxPropres: 0,
        resultatExercice: 0,
        periode: '',
        entrepriseId: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitForm = async () => {
        try {
            await axios.post('/api/bilans', form);
            alert("Bilan créé !");
        } catch (err) {
            console.error(err);
            alert("Erreur !");
        }
    };

    return (
        <div>
            <h3>Créer un Bilan Comptable</h3>
            <input type="date" name="dateBilan" onChange={handleChange} />
            <input type="number" name="actifNonCourant" onChange={handleChange} placeholder="Actif Non Courant" />
            <input type="number" name="actifCourant" onChange={handleChange} placeholder="Actif Courant" />
            <input type="number" name="passifNonCourant" onChange={handleChange} placeholder="Passif Non Courant" />
            <input type="number" name="passifCourant" onChange={handleChange} placeholder="Passif Courant" />
            <input type="number" name="capitauxPropres" onChange={handleChange} placeholder="Capitaux Propres" />
            <input type="number" name="resultatExercice" onChange={handleChange} placeholder="Résultat Exercice" />
            <input type="text" name="periode" onChange={handleChange} placeholder="Période (ex: 2024)" />
            <input type="text" name="entrepriseId" onChange={handleChange} placeholder="ID Entreprise" />
            <button onClick={submitForm}>Soumettre</button>
        </div>
    );
};

export default BilanForm;
