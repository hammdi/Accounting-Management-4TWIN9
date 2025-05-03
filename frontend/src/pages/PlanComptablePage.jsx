import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const PlanComptablePage = () => {
    const [groupedEntries, setGroupedEntries] = useState({});
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        fetchFilteredEntries();
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
        <div className="container mt-4">
            <h2 className="mb-4">📘 Plan Comptable - Écritures Comptables</h2>

            {/* 📅 Filtres de date */}
            <div className="d-flex align-items-center mb-3">
                <label className="me-2">📅 De :</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="form-control me-2" style={{ maxWidth: '200px' }} />
                <label className="me-2">à</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="form-control me-2" style={{ maxWidth: '200px' }} />
                <button onClick={fetchFilteredEntries} className="btn btn-primary">🔍 Filtrer</button>
            </div>

            {/* 📥 Export bouton */}
            <button onClick={handleExport} className="btn btn-success mb-4">📥 Exporter en Excel</button>

            {/* Table par compte */}
            {Object.keys(groupedEntries).length === 0 ? (
                <p>🔍 Aucune écriture comptable trouvée.</p>
            ) : (
                Object.entries(groupedEntries).map(([account, data]) => (
                    <div key={account} className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">📌 Compte {account} — {data.lines[0]?.libelle}</h5>
                            <p className="mt-1 mb-0"><strong>🧮 Total net :</strong> {data.total.toFixed(2)} DT</p>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table basic-table mb-0">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Type</th>
                                        <th>Montant</th>
                                        <th>Client</th>
                                        <th>Facture ID</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.lines.map((line, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{line.type.toUpperCase()}</td>
                                            <td>{line.amount} DT</td>
                                            <td>{line.clientName}</td>
                                            <td>{line.invoiceId}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PlanComptablePage;
