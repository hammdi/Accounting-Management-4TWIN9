import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useReactApexChart from '../../hook/useReactApexChart';
import ReactApexChart from 'react-apexcharts';

const CompanyStatusChart = () => {
    const [stats, setStats] = useState({
        active: 0,
        inactive: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('Yearly');

    const fetchCompanyStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const companies = response.data;
            const active = companies.filter(c => c.status === 'Active').length;
            const inactive = companies.filter(c => c.status === 'Inactive').length;

            setStats({
                active,
                inactive,
                total: companies.length
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch company stats');
            toast.error('Failed to load company statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyStats();
    }, [timeRange]);

    // Configuration du graphique
    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Active', 'Inactive'],
        colors: ['#45B369', '#FF487F'],
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#6B7280',
                            formatter: () => stats.total.toString()
                        }
                    }
                }
            }
        }
    };

    const chartSeries = [stats.active, stats.inactive];

    if (loading) {
        return (
            <div className="col-xxl-4 col-md-6">
                <div className="card h-100 radius-8 border-0">
                    <div className="card-body p-24 d-flex justify-content-center align-items-center">
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
            <div className="col-xxl-4 col-md-6">
                <div className="card h-100 radius-8 border-0">
                    <div className="card-body p-24">
                        <div className="alert alert-danger">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-xxl-4 col-md-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24 d-flex flex-column justify-content-between gap-8">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Company Status</h6>
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
                    
                    <div id="companyStatusDonutChart">
                        <ReactApexChart 
                            options={chartOptions} 
                            series={chartSeries} 
                            type="donut"
                            height={270} 
                        />
                    </div>
                    
                    <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                        <li className="d-flex flex-column gap-8">
                            <div className="d-flex align-items-center gap-2">
                                <span className="w-12-px h-12-px rounded-circle bg-success-600" />
                                <span className="text-secondary-light text-sm fw-semibold">
                                    Active
                                </span>
                            </div>
                            <span className="text-primary-light fw-bold">{stats.active}</span>
                        </li>
                        <li className="d-flex flex-column gap-8">
                            <div className="d-flex align-items-center gap-2">
                                <span className="w-12-px h-12-px rounded-circle bg-danger-600" />
                                <span className="text-secondary-light text-sm fw-semibold">
                                    Inactive
                                </span>
                            </div>
                            <span className="text-primary-light fw-bold">{stats.inactive}</span>
                        </li>
                        <li className="d-flex flex-column gap-8">
                            <div className="d-flex align-items-center gap-2">
                                <span className="w-12-px h-12-px rounded-circle bg-primary-600" />
                                <span className="text-secondary-light text-sm fw-semibold">
                                    Total
                                </span>
                            </div>
                            <span className="text-primary-light fw-bold">{stats.total}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CompanyStatusChart;