import React, { useEffect, useState } from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const TransactionStatistics = () => {
    const { barChartSeriesTwo, barChartOptionsTwo } = useReactApexChart();
    const [stats, setStats] = useState({
        monthlyData: [],
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        frequency: 'Monthly'
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
                const transactions = response.data.data;
                processTransactionData(transactions, frequency);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transaction data');
        } finally {
            setLoading(false);
        }
    };

    const processTransactionData = (transactions, frequency) => {
        // Group transactions by time period
        let groupedData = [];
        const now = new Date();
        
        if (frequency === 'Monthly') {
            // Last 12 months
            groupedData = Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date();
                monthDate.setMonth(now.getMonth() - (11 - i));
                
                const monthTransactions = transactions.filter(t => {
                    const tDate = new Date(t.date);
                    return tDate.getFullYear() === monthDate.getFullYear() && 
                           tDate.getMonth() === monthDate.getMonth();
                });
                
                const income = monthTransactions
                    .filter(t => t.type === 'Income')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                const expenses = monthTransactions
                    .filter(t => t.type === 'Expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                return {
                    period: monthDate.toLocaleDateString('en-US', { month: 'short' }),
                    income,
                    expenses,
                    net: income - expenses
                };
            });
        } else if (frequency === 'Weekly') {
            // Last 8 weeks
            groupedData = Array.from({ length: 8 }, (_, i) => {
                const weekDate = new Date();
                weekDate.setDate(now.getDate() - (7 * (7 - i)));
                
                const weekStart = new Date(weekDate);
                weekStart.setDate(weekDate.getDate() - weekDate.getDay());
                
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                const weekTransactions = transactions.filter(t => {
                    const tDate = new Date(t.date);
                    return tDate >= weekStart && tDate <= weekEnd;
                });
                
                const income = weekTransactions
                    .filter(t => t.type === 'Income')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                const expenses = weekTransactions
                    .filter(t => t.type === 'Expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                return {
                    period: `W${i+1}`,
                    income,
                    expenses,
                    net: income - expenses
                };
            });
        } else if (frequency === 'Today') {
            // Today's transactions
            const todayTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.toDateString() === now.toDateString();
            });
            
            const income = todayTransactions
                .filter(t => t.type === 'Income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expenses = todayTransactions
                .filter(t => t.type === 'Expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            groupedData = [{
                period: 'Today',
                income,
                expenses,
                net: income - expenses
            }];
        } else {
            // Yearly (default)
            const currentYear = now.getFullYear();
            const yearlyTransactions = transactions.filter(t => 
                new Date(t.date).getFullYear() === currentYear
            );
            
            const income = yearlyTransactions
                .filter(t => t.type === 'Income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expenses = yearlyTransactions
                .filter(t => t.type === 'Expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            groupedData = [{
                period: 'Year',
                income,
                expenses,
                net: income - expenses
            }];
        }

        // Calculate totals
        const totalIncome = groupedData.reduce((sum, d) => sum + d.income, 0);
        const totalExpenses = groupedData.reduce((sum, d) => sum + d.expenses, 0);
        const netProfit = totalIncome - totalExpenses;

        setStats({
            monthlyData: groupedData,
            totalIncome,
            totalExpenses,
            netProfit,
            frequency
        });

        // TODO: Update chart series and options based on groupedData
    };

    const handleFrequencyChange = (e) => {
        setStats(prev => ({ ...prev, frequency: e.target.value }));
    };

    if (loading) {
        return (
            <div className="col-xxl-8">
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

    return (
        <div className="col-xxl-8">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <div>
                            <h6 className="mb-2 fw-bold text-lg">Transaction Statistics</h6>
                            <span className="text-sm fw-medium text-secondary-light">
                                {stats.frequency} transaction overview
                            </span>
                        </div>
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
                    <div className="mt-20 d-flex justify-content-center flex-wrap gap-3">
                        <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
                            <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                                <Icon icon="fluent:arrow-trending-lines-20-filled" className="icon" />
                            </span>
                            <div>
                                <span className="text-secondary-light text-sm fw-medium">
                                    Income
                                </span>
                                <h6 className="text-md fw-semibold mb-0">{stats.totalIncome.toFixed(2)} DT</h6>
                            </div>
                        </div>
                        <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
                            <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                                <Icon icon="fluent:arrow-trending-down-20-filled" className="icon" />
                            </span>
                            <div>
                                <span className="text-secondary-light text-sm fw-medium">
                                    Expenses
                                </span>
                                <h6 className="text-md fw-semibold mb-0">{stats.totalExpenses.toFixed(2)} DT</h6>
                            </div>
                        </div>
                        <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
                            <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                                <Icon icon="ph:chart-line-up-fill" className="icon" />
                            </span>
                            <div>
                                <span className="text-secondary-light text-sm fw-medium">
                                    Net Profit
                                </span>
                                <h6 className={`text-md fw-semibold mb-0 ${
                                    stats.netProfit >= 0 ? 'text-success-main' : 'text-danger-main'
                                }`}>
                                    {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(2)} DT
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div id="transactionBarChart">
                        <ReactApexChart 
                            options={{
                                ...barChartOptionsTwo,
                                xaxis: {
                                    categories: stats.monthlyData.map(d => d.period),
                                    labels: {
                                        style: {
                                            colors: '#6B7280'
                                        }
                                    }
                                },
                                colors: ['#487fff', '#dc3545'],
                                legend: {
                                    position: 'top',
                                    horizontalAlign: 'right'
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
                                stroke: {
                                    show: true,
                                    width: 2,
                                    colors: ['transparent']
                                },
                                yaxis: {
                                    title: {
                                        text: 'Amount (DT)'
                                    },
                                    labels: {
                                        formatter: function (value) {
                                            return value.toFixed(2);
                                        }
                                    }
                                },
                                fill: {
                                    opacity: 1
                                },
                                tooltip: {
                                    y: {
                                        formatter: function (val) {
                                            return val.toFixed(2) + " DT";
                                        }
                                    }
                                }
                            }} 
                            series={[
                                {
                                    name: "Income",
                                    data: stats.monthlyData.map(d => d.income)
                                },
                                {
                                    name: "Expenses",
                                    data: stats.monthlyData.map(d => d.expenses)
                                }
                            ]} 
                            type="bar" 
                            height={310} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionStatistics;