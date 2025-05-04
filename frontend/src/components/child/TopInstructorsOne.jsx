import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TopCompanyOwners = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTopOwners = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Récupérer les compagnies avec les propriétaires peuplés
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { populate: 'owner' }
            });

            // Compter le nombre de compagnies par propriétaire
            const ownerStats = response.data.reduce((acc, company) => {
                if (company.owner) {
                    const ownerId = company.owner._id;
                    if (!acc[ownerId]) {
                        acc[ownerId] = {
                            ...company.owner,
                            companyCount: 0,
                            activeCompanies: 0
                        };
                    }
                    acc[ownerId].companyCount++;
                    if (company.status === 'Active') {
                        acc[ownerId].activeCompanies++;
                    }
                }
                return acc;
            }, {});

            // Trier par nombre de compagnies et prendre les top 6
            const sortedOwners = Object.values(ownerStats)
                .sort((a, b) => b.companyCount - a.companyCount)
                .slice(0, 6);

            setOwners(sortedOwners);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch owners data');
            toast.error('Failed to load company owners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopOwners();
    }, []);

    const renderRatingStars = (count) => {
        const stars = [];
        const filledStars = Math.min(5, Math.floor(count / 2)); // 1 étoile pour 2 compagnies
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className="text-lg text-warning-600 d-flex line-height-1">
                    <i className={`ri-star-${i < filledStars ? 'fill' : 'line'}`} />
                </span>
            );
        }
        return stars;
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
                        <h6 className="mb-2 fw-bold text-lg mb-0">Top Company Owners</h6>
                        <Link
                            to="/my-companies" // Adaptez selon vos routes
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
                    {owners.map((owner) => (
                        <div key={owner._id} className="d-flex align-items-center justify-content-between gap-3 mb-24">
                            <div className="d-flex align-items-center">
                                <div className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden bg-primary-50 d-flex justify-content-center align-items-center">
                                    {owner.avatar ? (
                                        <img
                                            src={owner.avatar}
                                            alt={owner.name}
                                            className="w-100 h-100 object-cover"
                                        />
                                    ) : (
                                        <Icon 
                                            icon="ri:user-fill" 
                                            className="text-primary-600 text-lg" 
                                        />
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="text-md mb-0 fw-medium">
                                        {owner.name || owner.email.split('@')[0]}
                                    </h6>
                                    <span className="text-sm text-secondary-light fw-medium">
                                        Owner ID: {owner._id.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                <div className="d-flex align-items-center gap-6 mb-1">
                                    {renderRatingStars(owner.companyCount)}
                                </div>
                                <span className="text-primary-light text-sm d-block text-end">
                                    {owner.companyCount} Companies
                                </span>
                                <span className="text-success-600 text-xs d-block text-end">
                                    {owner.activeCompanies} Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCompanyOwners;