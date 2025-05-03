import React, { useEffect, useState } from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const TransactionStatusStats = () => {
    const { paymentStatusChartSeriesTwo, paymentStatusChartOptionsTwo } = useReactApexChart();
    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        rejected: 0,
        weeklyData: [],
        frequency: 'Weekly'
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
        
        // Count by status
        const statusCounts = filteredTransactions.reduce((acc, tx) => {
            acc[tx.status] = (acc[tx.status] || 0) + 1;
            return acc;
        }, { approved: 0, pending: 0, rejected: 0 });

        // Prepare weekly data for chart
        const weeklyData = prepareWeeklyData(transactions);

        setStats({
            approved: statusCounts.approved,
            pending: statusCounts.pending,
            rejected: statusCounts.rejected,
            weeklyData,
            frequency
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
                cutoffDate.setDate(now.getDate() - 7);
        }

        return transactions.filter(tx => new Date(tx.date) >= cutoffDate);
    };

    const prepareWeeklyData = (transactions) => {
        // Last 4 weeks data
        return Array.from({ length: 4 }, (_, i) => {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (7 * (4 - i)));
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            const weekTransactions = transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate >= weekStart && txDate <= weekEnd;
            });

            return {
                week: `Week ${i+1}`,
                approved: weekTransactions.filter(tx => tx.status === 'approved').length,
                pending: weekTransactions.filter(tx => tx.status === 'pending').length,
                rejected: weekTransactions.filter(tx => tx.status === 'rejected').length
            };
        });
    };

    const handleFrequencyChange = (e) => {
        setStats(prev => ({ ...prev, frequency: e.target.value }));
    };

    if (loading) {
        return (
            <div className="col-xxl-4 col-sm-6">
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
        <div className="col-xxl-4 col-sm-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fw-bold text-lg">Transaction Status</h6>
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
                    <span className="text-sm fw-medium text-secondary-light">
                        {stats.frequency} Report
                    </span>
                    <ul className="d-flex flex-wrap align-items-center justify-content-center mt-32">
                        <li className="d-flex align-items-center gap-2 me-28">
                            <span className="w-12-px h-12-px rounded-circle bg-success-main" />
                            <span className="text-secondary-light text-sm fw-medium">
                                Approved: {stats.approved}
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2 me-28">
                            <span className="w-12-px h-12-px rounded-circle bg-info-main" />
                            <span className="text-secondary-light text-sm fw-medium">
                                Pending: {stats.pending}
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px rounded-circle bg-warning-main" />
                            <span className="text-secondary-light text-sm fw-medium">
                                Rejected: {stats.rejected}
                            </span>
                        </li>
                    </ul>
                    <div className="mt-40">
                        <ReactApexChart 
                            options={{
                                ...paymentStatusChartOptionsTwo,
                                xaxis: {
                                    categories: stats.weeklyData.map(w => w.week),
                                    labels: {
                                        style: {
                                            colors: '#6B7280'
                                        }
                                    }
                                },
                                colors: ['#28C76F', '#00CFE8', '#FF9F43'],
                                plotOptions: {
                                    bar: {
                                        horizontal: false,
                                        columnWidth: '45%',
                                        endingShape: 'rounded'
                                    }
                                },
                                dataLabels: {
                                    enabled: false
                                },
                                legend: {
                                    position: 'top',
                                    horizontalAlign: 'center'
                                },
                                tooltip: {
                                    y: {
                                        formatter: function(val) {
                                            return val + " transactions";
                                        }
                                    }
                                }
                            }}
                            series={[
                                {
                                    name: 'Approved',
                                    data: stats.weeklyData.map(w => w.approved)
                                },
                                {
                                    name: 'Pending',
                                    data: stats.weeklyData.map(w => w.pending)
                                },
                                {
                                    name: 'Rejected',
                                    data: stats.weeklyData.map(w => w.rejected)
                                }
                            ]} 
                            type="bar" 
                            height={350} 
                            id="transactionStatusChart" 
                            className="margin-16-minus" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionStatusStats;