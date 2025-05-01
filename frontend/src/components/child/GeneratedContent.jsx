import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { toast } from 'react-toastify';


const InvoicePaymentTrends = () => {
    const [timeRange, setTimeRange] = useState('Monthly');
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: true
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 4,
                    borderRadiusApplication: 'end'
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: [],
                labels: {
                    style: {
                        colors: '#6B7280',
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Amount ($)',
                    style: {
                        fontSize: '12px',
                        color: '#6B7280'
                    }
                },
                labels: {
                    formatter: function(value) {
                        return '$' + value.toLocaleString();
                    },
                    style: {
                        colors: '#6B7280',
                        fontSize: '12px'
                    }
                }
            },
            fill: {
                opacity: 1,
                colors: ['#5D87FF', '#FFAE1F', '#F44336']
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return '$' + val.toLocaleString();
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '12px',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 12
                }
            }
        }
    });
    const [stats, setStats] = useState({
        paid: 0,
        pending: 0,
        overdue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoiceStats();
    }, [timeRange]);

    const fetchInvoiceStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/myinvoices`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const invoices = response.data;
            processInvoiceData(invoices);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoice stats:", error);
            toast.error("Failed to load invoice statistics");
            setLoading(false);
        }
    };

    const processInvoiceData = (invoices) => {
        const now = new Date();
        let startDate, endDate;
        
        // Set date range based on selected timeframe
        if (timeRange === 'Today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
            endDate = new Date(now.setHours(23, 59, 59, 999));
        } else if (timeRange === 'Weekly') {
            startDate = new Date(now.setDate(now.getDate() - 7));
            endDate = new Date();
        } else if (timeRange === 'Monthly') {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            endDate = new Date();
        } else { // Yearly
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            endDate = new Date();
        }

        // Filter invoices by date range
        const filteredInvoices = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.createdAt);
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });

        // Calculate totals by status
        const paid = filteredInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
        const pending = filteredInvoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
        const overdue = filteredInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

        setStats({ paid, pending, overdue });

        // Prepare chart data
        let categories = [];
        let paidData = [];
        let pendingData = [];
        let overdueData = [];

        if (timeRange === 'Today') {
            // Group by hours for today
            categories = Array.from({length: 24}, (_, i) => `${i}:00`);
            paidData = Array(24).fill(0);
            pendingData = Array(24).fill(0);
            overdueData = Array(24).fill(0);

            filteredInvoices.forEach(invoice => {
                const hour = new Date(invoice.createdAt).getHours();
                const amount = invoice.totalAmount || 0;
                
                if (invoice.status === 'Paid') paidData[hour] += amount;
                else if (invoice.status === 'Pending') pendingData[hour] += amount;
                else if (invoice.status === 'Overdue') overdueData[hour] += amount;
            });
        } else {
            // Group by days for other timeframes
            const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            categories = Array.from({length: daysDiff}, (_, i) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });

            paidData = Array(daysDiff).fill(0);
            pendingData = Array(daysDiff).fill(0);
            overdueData = Array(daysDiff).fill(0);

            filteredInvoices.forEach(invoice => {
                const invoiceDate = new Date(invoice.createdAt);
                const dayIndex = Math.floor((invoiceDate - startDate) / (1000 * 60 * 60 * 24));
                const amount = invoice.totalAmount || 0;
                
                if (dayIndex >= 0 && dayIndex < daysDiff) {
                    if (invoice.status === 'Paid') paidData[dayIndex] += amount;
                    else if (invoice.status === 'Pending') pendingData[dayIndex] += amount;
                    else if (invoice.status === 'Overdue') overdueData[dayIndex] += amount;
                }
            });
        }

        setChartData(prev => ({
            ...prev,
            series: [
                { name: 'Paid', data: paidData },
                { name: 'Pending', data: pendingData },
                { name: 'Overdue', data: overdueData }
            ],
            options: {
                ...prev.options,
                xaxis: {
                    ...prev.options.xaxis,
                    categories: categories
                }
            }
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Invoice Payment Trends</h6>
                        <select 
                            className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="Today">Today</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    <ul className="d-flex flex-wrap align-items-center mt-3 gap-3">
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px rounded-circle bg-primary-600" />
                            <span className="text-secondary-light text-sm fw-semibold">
                                Paid:
                                <span className="text-primary-light fw-bold"> {formatCurrency(stats.paid)}</span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px rounded-circle bg-yellow" />
                            <span className="text-secondary-light text-sm fw-semibold">
                                Pending:
                                <span className="text-primary-light fw-bold"> {formatCurrency(stats.pending)}</span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px rounded-circle bg-danger" />
                            <span className="text-secondary-light text-sm fw-semibold">
                                Overdue:
                                <span className="text-primary-light fw-bold"> {formatCurrency(stats.overdue)}</span>
                            </span>
                        </li>
                    </ul>
                    <div className="mt-40">
                        <div className="margin-16-minus">
                            {loading ? (
                                <div className="text-center py-4">Loading payment trends...</div>
                            ) : (
                                <ReactApexChart 
                                    options={chartData.options} 
                                    series={chartData.series} 
                                    type="bar" 
                                    height={250} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePaymentTrends;