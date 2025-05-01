import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvoiceStatistics = () => {
    const [timeRange, setTimeRange] = useState('Yearly');
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$" + val.toLocaleString();
                    }
                }
            },
            colors: ['#5D87FF', '#49BEFF']
            },
        series: [
            {
                name: 'Paid Invoices',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: 'Total Revenue',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
    });
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [growthPercentage, setGrowthPercentage] = useState(0);
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
        const currentYear = now.getFullYear();
        
        // Initialize monthly data
        const monthlyData = {
            paidCount: Array(12).fill(0),
            revenue: Array(12).fill(0),
            previousRevenue: Array(12).fill(0)
        };

        invoices.forEach(invoice => {
            const invoiceDate = new Date(invoice.createdAt);
            const month = invoiceDate.getMonth();
            const year = invoiceDate.getFullYear();
            
            if (year === currentYear) {
                monthlyData.revenue[month] += invoice.totalAmount || 0;
                if (invoice.status === 'Paid') {
                    monthlyData.paidCount[month]++;
                }
            } else if (year === currentYear - 1) {
                monthlyData.previousRevenue[month] += invoice.totalAmount || 0;
            }
        });

        // Calculate total revenue
        const total = monthlyData.revenue.reduce((sum, val) => sum + val, 0);
        setTotalRevenue(total);

        // Calculate growth percentage compared to previous year
        const prevTotal = monthlyData.previousRevenue.reduce((sum, val) => sum + val, 0);
        const growth = prevTotal > 0 ? ((total - prevTotal) / prevTotal * 100) : 100;
        setGrowthPercentage(Math.round(growth));

        // Update chart data
        setChartData(prev => ({
            ...prev,
            series: [
                {
                    name: 'Paid Invoices',
                    data: monthlyData.paidCount
                },
                {
                    name: 'Total Revenue',
                    data: monthlyData.revenue
                }
            ]
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
        <div className="col-xxl-6 col-xl-12">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                        <h6 className="text-lg mb-0">Invoice Statistics</h6>
                        <select 
                            className="form-select bg-base form-select-sm w-auto" 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="Yearly">Yearly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Today">Today</option>
                        </select>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                        <h6 className="mb-0">{formatCurrency(totalRevenue)}</h6>
                        <span className={`text-sm fw-semibold rounded-pill ${growthPercentage >= 0 ? 'bg-success-focus text-success-main' : 'bg-danger-focus text-danger-main'} border px-8 py-4 line-height-1 d-flex align-items-center gap-1`}>
                            {Math.abs(growthPercentage)}% 
                            <Icon 
                                icon={growthPercentage >= 0 ? "bxs:up-arrow" : "bxs:down-arrow"} 
                                className="text-xs" 
                            />
                        </span>
                        <span className="text-xs fw-medium">
                            {growthPercentage >= 0 ? '+' : '-'} {formatCurrency(Math.abs(totalRevenue * growthPercentage / 100))} vs last year
                        </span>
                    </div>
                    {loading ? (
                        <div className="text-center py-4">Loading invoice statistics...</div>
                    ) : (
                        <ReactApexChart 
                            options={chartData.options} 
                            series={chartData.series} 
                            type="area" 
                            height={264} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceStatistics;