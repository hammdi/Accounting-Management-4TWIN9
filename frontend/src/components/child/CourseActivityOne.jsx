import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const CompanyActivityChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#3B82F6', '#10B981'],
            xaxis: {
                categories: [],
            },
            yaxis: {
                title: {
                    text: 'Number of Companies'
                }
            },
            legend: {
                position: 'top'
            },
            fill: {
                opacity: 1
            }
        }
    });
    const [stats, setStats] = useState({
        active: 0,
        inactive: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchCompanyData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const companies = response.data;
            const active = companies.filter(c => c.status === 'Active').length;
            const inactive = companies.length - active;

            // Group by month
            const monthlyData = companies.reduce((acc, company) => {
                const date = new Date(company.createdAt);
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                const key = `${month} ${year}`;
                
                if (!acc[key]) {
                    acc[key] = { active: 0, inactive: 0 };
                }
                
                if (company.status === 'Active') {
                    acc[key].active++;
                } else {
                    acc[key].inactive++;
                }
                
                return acc;
            }, {});

            const months = Object.keys(monthlyData);
            const activeData = months.map(month => monthlyData[month].active);
            const inactiveData = months.map(month => monthlyData[month].inactive);

            setChartData({
                series: [
                    { name: 'Active', data: activeData },
                    { name: 'Inactive', data: inactiveData }
                ],
                options: {
                    ...chartData.options,
                    xaxis: {
                        categories: months
                    }
                }
            });

            setStats({ active, inactive });
        } catch (error) {
            toast.error('Failed to load company data');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, []);

    if (loading) {
        return (
            <div className="col-xxl-4">
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
        <div className="col-xxl-4">
            <div className="card h-100">
                <div className="card-header">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Company Activity</h6>
                        <Link
                            to="/my-companies"
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
                <div className="card-body p-24">
                    <ul className="d-flex flex-wrap align-items-center justify-content-center my-3 gap-3">
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px rounded-circle bg-primary-600" />
                            <span className="text-secondary-light text-sm fw-semibold">
                                Active:
                                <span className="text-primary-light fw-bold">{stats.active}</span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px rounded-circle bg-danger-600" />
                            <span className="text-secondary-light text-sm fw-semibold">
                                Inactive:
                                <span className="text-primary-light fw-bold">{stats.inactive}</span>
                            </span>
                        </li>
                    </ul>
                    <ReactApexChart 
                        options={chartData.options} 
                        series={chartData.series} 
                        type="bar" 
                        height={420} 
                    />
                </div>
            </div>
        </div>
    );
};

export default CompanyActivityChart;