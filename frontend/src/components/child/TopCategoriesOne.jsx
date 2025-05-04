import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TopCompanies = () => {
    const [topCompanies, setTopCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTopCompanies = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Trier les compagnies par date de création (les plus récentes d'abord)
            const sortedCompanies = response.data.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            ).slice(0, 6); // Prendre les 6 plus récentes

            setTopCompanies(sortedCompanies);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch companies');
            toast.error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopCompanies();
    }, []);

    const getStatusBadge = (status) => {
        const colorClass = status === 'Active' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600';
        return (
            <span className={`text-xs px-8 py-2 rounded-pill ${colorClass}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="col-xxl-4 col-md-6">
                <div className="card">
                    <div className="card-body">
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-xxl-4 col-md-6">
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-danger">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-xxl-4 col-md-6">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Recent Companies</h6>
                        <Link
                            to="/my-companies" // Adaptez ce lien selon votre route
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>
                </div>
                <div className="card-body">
                    {topCompanies.map((company, index) => (
                        <div key={company._id} className="d-flex align-items-center justify-content-between gap-3 mb-24">
                            <div className="d-flex align-items-center gap-12 w-100">
                                <div className="w-40-px h-40-px radius-8 flex-shrink-0 bg-primary-50 d-flex justify-content-center align-items-center">
                                    <Icon 
                                        icon="ri:building-fill" 
                                        className="text-primary-600 text-lg" 
                                    />
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h6 className="text-md mb-4 fw-normal text-truncate">{company.name}</h6>
                                    <div className="d-flex align-items-center gap-8">
                                        {getStatusBadge(company.status)}
                                        <span className="text-sm text-secondary-light fw-normal">
                                            {company.accountants?.length || 0} Accountants
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to={`/companies/${company._id}`} // Adaptez ce lien selon votre route
                                className="w-24-px h-24-px bg-primary-50 text-primary-600 d-flex justify-content-center align-items-center text-lg bg-hover-primary-100 radius-4 flex-shrink-0"
                            >
                                <i className="ri-arrow-right-s-line" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCompanies;