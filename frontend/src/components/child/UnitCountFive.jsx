import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useReactApexChart from '../../hook/useReactApexChart';

const CompanyStatsCard = () => {
    const { createChartSix } = useReactApexChart();
    const [stats, setStats] = useState({
        totalCompanies: 0,
        activeCompanies: 0,
        inactiveCompanies: 0,
        newThisMonth: 0,
        accountantsCount: 0,
        monthlyActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('Yearly');

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Récupérer toutes les compagnies
            const companiesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const companies = companiesResponse.data;
            const totalCompanies = companies.length;
            const activeCompanies = companies.filter(c => c.status === 'Active').length;
            const inactiveCompanies = totalCompanies - activeCompanies;
            
            // Compter les nouveaux cette mois
            const currentMonth = new Date().getMonth();
            const newThisMonth = companies.filter(c => 
                new Date(c.createdAt).getMonth() === currentMonth
            ).length;
            
            // Compter le total des comptables
            const accountantsCount = companies.reduce(
                (acc, company) => acc + (company.accountants?.length || 0), 0
            );
            
            // Données pour le graphique (simplifié)
            const monthlyActivity = Array(12).fill(0).map((_, i) => {
                const month = new Date();
                month.setMonth(month.getMonth() - (11 - i));
                return {
                    name: month.toLocaleString('default', { month: 'short' }),
                    active: companies.filter(c => 
                        c.status === 'Active' && 
                        new Date(c.createdAt).getMonth() === month.getMonth() &&
                        new Date(c.createdAt).getFullYear() === month.getFullYear()
                    ).length,
                    inactive: companies.filter(c => 
                        c.status === 'Inactive' && 
                        new Date(c.createdAt).getMonth() === month.getMonth() &&
                        new Date(c.createdAt).getFullYear() === month.getFullYear()
                    ).length
                };
            });

            setStats({
                totalCompanies,
                activeCompanies,
                inactiveCompanies,
                newThisMonth,
                accountantsCount,
                monthlyActivity
            });
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch statistics');
            toast.error('Failed to load company statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="col-xxl-8">
                <div className="card radius-8 border-0 p-20">
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-xxl-8">
                <div className="card radius-8 border-0 p-20">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-xxl-8">
            <div className="card radius-8 border-0 p-20">
                <div className="row gy-4">
                    <div className="col-xxl-4">
                        <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-1 mb-12">
                            <div className="card-body p-0">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                    <div className="d-flex align-items-center gap-2 mb-12">
                                        <span className="mb-0 w-48-px h-48-px bg-base text-pink text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                            <i className="ri-building-fill" />
                                        </span>
                                        <div>
                                            <span className="mb-0 fw-medium text-secondary-light text-lg">
                                                Total Companies
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                    <h5 className="fw-semibold mb-0">{stats.totalCompanies}</h5>
                                    <p className="text-sm mb-0 d-flex align-items-center gap-8">
                                        <span className="text-white px-1 rounded-2 fw-medium bg-success-main text-sm">
                                            +{stats.newThisMonth}
                                        </span>
                                        This Month
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-2 mb-12">
                            <div className="card-body p-0">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                    <div className="d-flex align-items-center gap-2 mb-12">
                                        <span className="mb-0 w-48-px h-48-px bg-base text-purple text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                            <i className="ri-account-circle-fill" />
                                        </span>
                                        <div>
                                            <span className="mb-0 fw-medium text-secondary-light text-lg">
                                                Total Accountants
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                    <h5 className="fw-semibold mb-0">{stats.accountantsCount}</h5>
                                    <p className="text-sm mb-0 d-flex align-items-center gap-8">
                                        <span className="text-white px-1 rounded-2 fw-medium bg-success-main text-sm">
                                            +{Math.floor(stats.accountantsCount * 0.1)}
                                        </span>
                                        This Month
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-3 mb-0">
                            <div className="card-body p-0">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                    <div className="d-flex align-items-center gap-2 mb-12">
                                        <span className="mb-0 w-48-px h-48-px bg-base text-info text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                            <i className="ri-pie-chart-fill" />
                                        </span>
                                        <div>
                                            <span className="mb-0 fw-medium text-secondary-light text-lg">
                                                Status Ratio
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                    <div>
                                        <h5 className="fw-semibold mb-0">{stats.activeCompanies} Active</h5>
                                        <h5 className="fw-semibold mb-0">{stats.inactiveCompanies} Inactive</h5>
                                    </div>
                                    <p className="text-sm mb-0 d-flex align-items-center gap-8">
                                        <span className="text-white px-1 rounded-2 fw-medium bg-success-main text-sm">
                                            {stats.totalCompanies > 0 
                                                ? Math.round((stats.activeCompanies / stats.totalCompanies) * 100) 
                                                : 0}%
                                        </span>
                                        Active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-8">
                        <div className="card-body p-0">
                            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 className="mb-2 fw-bold text-lg">Company Activity</h6>
                                <div className="">
                                    <select 
                                        className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                    >
                                        <option value="Yearly">Yearly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Today">Today</option>
                                    </select>
                                </div>
                            </div>
                            <ul className="d-flex flex-wrap align-items-center justify-content-center mt-3 gap-3">
                                <li className="d-flex align-items-center gap-2">
                                    <span className="w-12-px h-12-px rounded-circle bg-primary-600" />
                                    <span className="text-secondary-light text-sm fw-semibold">
                                        Active:
                                        <span className="text-primary-light fw-bold">{stats.activeCompanies}</span>
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <span className="w-12-px h-12-px rounded-circle bg-danger-main" />
                                    <span className="text-secondary-light text-sm fw-semibold">
                                        Inactive:
                                        <span className="text-primary-light fw-bold">{stats.inactiveCompanies}</span>
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-40">
                                <div
                                    id="companyActivityChart"
                                    className="apexcharts-tooltip-style-1"
                                >
                                    {createChartSix('#45B369', '#ff487f', stats.monthlyActivity)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyStatsCard;