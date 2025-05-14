import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MasterLayout from "../masterLayout/MasterLayout";

const AccountsListPage = () => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        axios.get('https://backend2-fix5.onrender.com/api/comptes')
            .then(res => setAccounts(res.data))
            .catch(err => console.error("❌ Error fetching accounts:", err));
    }, []);

    return (
        <MasterLayout>
            <div className="col-lg-10 mx-auto">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Accounting plan</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table basic-table mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Account Number</th>
                                    <th>Label</th>
                                    <th>Level</th>
                                    <th>Balance (TND)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {accounts.map((account, index) => (
                                    <tr key={account._id}>
                                        <td>{index + 1}</td>
                                        <td>{account.numero}</td>
                                        <td>{account.libelle}</td>
                                        <td>{account.niveau}</td>
                                        <td>{account.solde?.toFixed(3)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AccountsListPage;
