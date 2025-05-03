import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CompaniesTable = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompanies(response.data);
        } catch (error) {
            toast.error('Failed to load company data');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const colorClass = status === 'Active' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600';
        return (
            <span className={`text-xs px-12 py-4 rounded-pill ${colorClass}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="col-xxl-8">
                <div className="card h-100">
                    <div className="card-body d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-xxl-8">
            <div className="card h-100">
                <div className="card-header">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Companies</h6>
                        <Link
                            to="/companies"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                        </Link>
                    </div>
                </div>
                <div className="card-body p-24">
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Created On</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Company Details</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Accountants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.slice(0, 5).map((company) => (
                                    <tr key={company._id}>
                                        <td>
                                            <span className="text-secondary-light">
                                                {formatDate(company.createdAt)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-secondary-light">
                                                {company.owner?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-secondary-light">
                                                <h6 className="text-md mb-0 fw-normal">
                                                    {company.name}
                                                </h6>
                                                <span className="text-sm fw-normal">
                                                    {company.taxNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {getStatusBadge(company.status)}
                                        </td>
                                        <td>
                                            <span className="text-secondary-light">
                                                {company.accountants?.length || 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompaniesTable;