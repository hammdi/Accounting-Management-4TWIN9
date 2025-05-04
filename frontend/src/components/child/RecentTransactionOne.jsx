import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const RecentTaxTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecentTaxes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taxes/getalltaxes?sort=-createdAt&limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTransactions(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching recent tax transactions");
                console.error("Error fetching taxes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentTaxes();
    }, []);

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="col-xxl-12">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Recent Tax Filings</h6>
                        <Link
                            to="/taxcompliance-list"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0 xsm-table">
                            <thead>
                                <tr>
                                    <th scope="col">Company</th>
                                    <th scope="col">Date &amp; Time</th>
                                    <th scope="col">Tax Amount</th>
                                    <th scope="col">Tax Year</th>
                                    <th scope="col" className="text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((tax, index) => {
                                        const date = new Date(tax.createdAt || tax.dueDate);
                                        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`${tax.status === 'Filed' ? 'text-success-main bg-success-focus' : 'text-warning-main bg-warning-focus'} w-32-px h-32-px d-flex align-items-center justify-content-center rounded-circle text-xl`}>
                                                            <Icon
                                                                icon={tax.status === 'Filed' ? "tabler:file-check" : "tabler:file-alert"}
                                                                className="icon"
                                                            />
                                                        </span>
                                                        <span className="fw-medium">{tax.company?.name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-primary-light d-block fw-medium">
                                                        {formattedTime}
                                                    </span>
                                                    <span className="text-secondary-light text-sm">
                                                        {formattedDate}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-primary-light d-block fw-medium">
                                                        ${tax.taxAmount?.toLocaleString() || '0'}
                                                    </span>
                                                    <span className="text-secondary-light text-sm">
                                                        Due: {new Date(tax.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </td>
                                                <td>{tax.taxYear}</td>
                                                <td className="text-center">
                                                    <span className={`${tax.status === 'Filed' ? 'bg-success-focus text-success-main' : 'bg-warning-focus text-warning-main'} px-16 py-4 radius-4 fw-medium text-sm`}>
                                                        {tax.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            No recent tax transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentTaxTransactions;