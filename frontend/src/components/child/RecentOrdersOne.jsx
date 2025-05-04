import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecentPayrolls = () => {
    const [recentPayrolls, setRecentPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentPayrolls = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payrolls/getallpayrolls`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        sort: '-paymentDate',
                        limit: 5
                    }
                });
                
                setRecentPayrolls(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching recent payrolls");
                setLoading(false);
            }
        };

        fetchRecentPayrolls();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    if (loading) return (
        <div className="col-xxl-9 col-lg-6">
            <div className="card h-100">
                <div className="card-body d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:loading" className="animate-spin text-4xl" />
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="col-xxl-9 col-lg-6">
            <div className="card h-100">
                <div className="card-body text-danger">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="col-xxl-9 col-lg-6">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Recent Payrolls</h6>
                        <Link
                            to="/payroll-list"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                        </Link>
                    </div>
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Employee</th>
                                    <th scope="col">Company</th>
                                    <th scope="col">Payment Date</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col" className="text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPayrolls.length > 0 ? (
                                    recentPayrolls.map((payroll) => (
                                        <tr key={payroll._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-12 radius-8 bg-primary-light text-primary-600 w-40-px h-40-px d-flex justify-content-center align-items-center">
                                                        <Icon icon="ion:person" className="icon" />
                                                    </div>
                                                    <span className="text-lg text-secondary-light fw-semibold flex-grow-1">
                                                        {payroll.employee?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{payroll.company?.name || 'N/A'}</td>
                                            <td>{formatDate(payroll.paymentDate)}</td>
                                            <td>${payroll.salary?.toLocaleString() || '0'}</td>
                                            <td className="text-center">
                                                <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${
                                                    payroll.status === "Paid" 
                                                        ? "bg-success-focus text-success-main" 
                                                        : "bg-warning-focus text-warning-main"
                                                }`}>
                                                    {payroll.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            No recent payrolls found
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

export default RecentPayrolls;