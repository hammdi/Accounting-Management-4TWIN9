import React, { useEffect, useState } from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const TransactionCategories = () => {
    const { donutChartSeriesTwo, donutChartOptionsTwo } = useReactApexChart();
    const [stats, setStats] = useState({
        categories: [],
        paymentMethods: [],
        frequency: 'Monthly',
        totalTransactions: 0,
        newTransactions: 0,
        highRiskTransactions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactionStats(stats.frequency);
    }, [stats.frequency]);

    const fetchTransactionStats = async (frequency) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/mytransactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                processTransactionData(response.data.data, frequency);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transaction data');
        } finally {
            setLoading(false);
        }
    };

    const processTransactionData = (transactions, frequency) => {
        // Filter transactions based on frequency
        const filteredTransactions = filterByFrequency(transactions, frequency);
        
        // Calculate category distribution
        const categoryMap = {};
        const paymentMethodMap = {};
        let highRiskCount = 0;

        filteredTransactions.forEach(tx => {
            // Count by category
            categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
            
            // Count by payment method
            paymentMethodMap[tx.paymentMethod] = (paymentMethodMap[tx.paymentMethod] || 0) + 1;
            
            // Count high risk (example logic)
            if (tx.amount > 1000) highRiskCount++;
        });

        // Convert to arrays for display
        const categories = Object.keys(categoryMap).map(key => ({
            name: key,
            amount: categoryMap[key],
            percentage: (categoryMap[key] / filteredTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100
        })).sort((a, b) => b.amount - a.amount);

        const paymentMethods = Object.keys(paymentMethodMap).map(key => ({
            name: key,
            count: paymentMethodMap[key],
            percentage: (paymentMethodMap[key] / filteredTransactions.length) * 100
        })).sort((a, b) => b.count - a.count);

        setStats({
            categories,
            paymentMethods,
            frequency,
            totalTransactions: filteredTransactions.length,
            newTransactions: Math.floor(filteredTransactions.length * 0.3), // 30% as new
            highRiskTransactions: highRiskCount
        });
    };

    const filterByFrequency = (transactions, frequency) => {
        const now = new Date();
        const cutoffDate = new Date();

        switch (frequency) {
            case 'Today':
                cutoffDate.setDate(now.getDate() - 1);
                break;
            case 'Weekly':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'Monthly':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case 'Yearly':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                cutoffDate.setMonth(now.getMonth() - 1);
        }

        return transactions.filter(tx => new Date(tx.date) >= cutoffDate);
    };

    const handleFrequencyChange = (e) => {
        setStats(prev => ({ ...prev, frequency: e.target.value }));
    };

    if (loading) {
        return (
            <div className="col-xxl-4">
                <div className="row gy-4">
                    <div className="col-xxl-12 col-sm-6">
                        <div className="card h-100 radius-8 border-0">
                            <div className="card-body p-24 d-flex justify-content-center align-items-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-12 col-sm-6">
                        <div className="card h-100 radius-8 border-0">
                            <div className="card-body p-24 d-flex justify-content-center align-items-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-xxl-4">
            <div className="row gy-4">
                <div className="col-xxl-12 col-sm-6">
                    <div className="card h-100 radius-8 border-0">
                        <div className="card-body p-24">
                            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 className="mb-2 fw-bold text-lg">Transaction Categories</h6>
                                <div className="">
                                    <select 
                                        className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                                        value={stats.frequency}
                                        onChange={handleFrequencyChange}
                                    >
                                        <option value="Yearly">Yearly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Today">Today</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                {stats.categories.slice(0, 4).map((category, index) => {
                                    const colors = ['#FF9F43', '#28C76F', '#00CFE8', '#7367F0'];
                                    const icons = [
                                        'fluent:receipt-money-20-filled',
                                        'icon-park-outline:shopping',
                                        'material-symbols:home-work-outline',
                                        'mdi:transportation'
                                    ];
                                    
                                    return (
                                        <div key={index} className="d-flex align-items-center justify-content-between gap-3 mb-12">
                                            <div className="d-flex align-items-center">
                                                <span className={`text-xxl line-height-1 d-flex align-content-center flex-shrink-0`} style={{ color: colors[index] }}>
                                                    <Icon icon={icons[index]} className="icon" />
                                                </span>
                                                <span className="text-primary-light fw-medium text-sm ps-12">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 w-100">
                                                <div className="w-100 max-w-66 ms-auto">
                                                    <div
                                                        className="progress progress-sm rounded-pill"
                                                        role="progressbar"
                                                        aria-valuenow={category.percentage}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar rounded-pill"
                                                            style={{ 
                                                                width: `${category.percentage}%`,
                                                                backgroundColor: colors[index]
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-secondary-light font-xs fw-semibold">
                                                    {category.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-12 col-sm-6">
                    <div className="card h-100 radius-8 border-0 overflow-hidden">
                        <div className="card-body p-24">
                            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 className="mb-2 fw-bold text-lg">Transaction Overview</h6>
                                <div className="">
                                    <select 
                                        className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                                        value={stats.frequency}
                                        onChange={handleFrequencyChange}
                                    >
                                        <option value="Yearly">Yearly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Today">Today</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-center mt-3">
                                <ul className="flex-shrink-0">
                                    <li className="d-flex align-items-center gap-2 mb-28">
                                        <span className="w-12-px h-12-px rounded-circle bg-success-main" />
                                        <span className="text-secondary-light text-sm fw-medium">
                                            Total: {stats.totalTransactions}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2 mb-28">
                                        <span className="w-12-px h-12-px rounded-circle bg-warning-main" />
                                        <span className="text-secondary-light text-sm fw-medium">
                                            New: {stats.newTransactions}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-2">
                                        <span className="w-12-px h-12-px rounded-circle bg-primary-600" />
                                        <span className="text-secondary-light text-sm fw-medium">
                                            High Risk: {stats.highRiskTransactions}
                                        </span>
                                    </li>
                                </ul>
                                <div className="flex-grow-1">
                                    <ReactApexChart 
                                        options={{
                                            ...donutChartOptionsTwo,
                                            labels: stats.paymentMethods.map(m => m.name),
                                            colors: ['#00CFE8', '#7367F0', '#FF9F43', '#EA5455'],
                                            legend: {
                                                position: 'right',
                                                markers: {
                                                    width: 8,
                                                    height: 8,
                                                    radius: 0
                                                },
                                                itemMargin: {
                                                    horizontal: 10,
                                                    vertical: 5
                                                }
                                            },
                                            dataLabels: {
                                                enabled: false
                                            },
                                            tooltip: {
                                                y: {
                                                    formatter: function(val) {
                                                        return val + " transactions";
                                                    }
                                                }
                                            }
                                        }}
                                        series={stats.paymentMethods.map(m => m.count)} 
                                        type="donut" 
                                        height={300} 
                                        id="paymentMethodChart"
                                        className="apexcharts-tooltip-z-none title-style circle-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCategories;