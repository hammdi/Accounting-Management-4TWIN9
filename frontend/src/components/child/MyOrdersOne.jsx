import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import axios from "axios";

const TaxComplianceList = () => {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('This Year');

    useEffect(() => {
        const fetchTaxes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taxes/getalltaxes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTaxes(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching tax data");
                console.error("Error fetching taxes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxes();
    }, [timeRange]);

    const filteredTaxes = taxes.filter(tax => {
        const now = new Date();
        const taxDate = new Date(tax.dueDate);
        
        if (timeRange === 'Today') {
            return taxDate.toDateString() === now.toDateString();
        } else if (timeRange === 'Weekly') {
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
            return taxDate >= oneWeekAgo;
        } else if (timeRange === 'Monthly') {
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return taxDate >= oneMonthAgo;
        }
        return true; // 'This Year' - no filter
    });

    const handleDelete = async (taxId) => {
        if (!window.confirm("Are you sure you want to delete this tax record?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/taxes/deletetax/${taxId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTaxes(taxes.filter(tax => tax._id !== taxId));
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting tax record");
            console.error("Error deleting tax:", error);
        }
    };

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="col-xxl-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg">Tax Compliance Records</h6>
                        <div className="">
                            <select 
                                className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="Today">Today</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="This Year">This Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Status</th>
                                    <th scope="col">Tax Year</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col" className="text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTaxes.length > 0 ? (
                                    filteredTaxes.map((tax, index) => (
                                        <tr key={index}>
                                            <td>
                                                <span className={`${tax.status === 'Filed' ? 'text-success-main' : 'text-warning-main'}`}>
                                                    {tax.status}
                                                </span>
                                            </td>
                                            <td>{tax.taxYear}</td>
                                            <td>${tax.taxAmount?.toLocaleString() || '0'}</td>
                                            <td className="text-center line-height-1">
                                                <button
                                                    type="button"
                                                    className="text-lg text-danger-main remove-btn"
                                                    onClick={() => handleDelete(tax._id)}
                                                >
                                                    <Icon
                                                        icon="radix-icons:cross-2"
                                                        className="icon"
                                                    />{" "}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            No tax records found for selected period
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

export default TaxComplianceList;