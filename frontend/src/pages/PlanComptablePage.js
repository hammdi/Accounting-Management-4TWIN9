import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const PlanComptablePage = () => {
    const [groupedEntries, setGroupedEntries] = useState({});
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        fetchFilteredEntries(); // Load all on mount
    }, []);

    const fetchFilteredEntries = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/accounting-entries');
            const entries = res.data;

            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            const grouped = {};

            entries.forEach(entry => {
                const invoice = entry.invoice;
                if (!invoice || !invoice.createdAt) return;

                const invoiceDate = new Date(invoice.createdAt);
                if ((from && invoiceDate < from) || (to && invoiceDate > to)) return;

                const invoiceId = invoice._id;
                const invoiceName = invoice.clientName;

                entry.entries.forEach(line => {
                    const key = line.account;
                    if (!grouped[key]) {
                        grouped[key] = { total: 0, lines: [] };
                    }

                    grouped[key].total += line.type === 'credit' ? line.amount : -line.amount;

                    grouped[key].lines.push({
                        ...line,
                        invoiceId,
                        clientName: invoiceName
                    });
                });
            });

            setGroupedEntries(grouped);
        } catch (err) {
            console.error("Erreur chargement écritures :", err);
        }
    };

    const handleExport = () => {
        const data = [];

        Object.entries(groupedEntries).forEach(([account, dataObj]) => {
            dataObj.lines.forEach(line => {
                data.push({
                    Compte: account,
                    Libelle: line.libelle,
                    Type: line.type.toUpperCase(),
                    Montant: line.amount,
                    Client: line.clientName,
                    Facture_ID: line.invoiceId
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ecritures Comptables');
        XLSX.writeFile(workbook, 'Plan_Comptable_Export.xlsx');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>📘 Plan Comptable - Écritures Comptables</h2>

            {/* 📅 Date Filters */}
            <div style={{ margin: '20px 0' }}>
                <label style={{ marginRight: '10px' }}>📅 De :</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                <label style={{ margin: '0 10px' }}>à</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                <button onClick={fetchFilteredEntries} style={{ marginLeft: '10px' }}>
                    🔍 Filtrer
                </button>
            </div>

            {/* 📥 Export */}
            <button onClick={handleExport} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                📥 Exporter en Excel
            </button>

            {Object.keys(groupedEntries).length === 0 ? (
                <p>🔍 Aucune écriture comptable trouvée.</p>
            ) : (
                Object.entries(groupedEntries).map(([account, data]) => (
                    <div key={account} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                        <h3>📌 Compte {account} — {data.lines[0]?.libelle}</h3>
                        <p><strong>🧮 Total net :</strong> {data.total.toFixed(2)} DT</p>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid black' }}>Type</th>
                                <th style={{ borderBottom: '1px solid black' }}>Montant</th>
                                <th style={{ borderBottom: '1px solid black' }}>Client</th>
                                <th style={{ borderBottom: '1px solid black' }}>Facture ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.lines.map((line, i) => (
                                <tr key={i}>
                                    <td>{line.type.toUpperCase()}</td>
                                    <td>{line.amount} DT</td>
                                    <td>{line.clientName}</td>
                                    <td>{line.invoiceId}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
};

export default PlanComptablePage;
