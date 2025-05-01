import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvoicePaymentTrends = () => {
    const [timeRange, setTimeRange] = useState('Monthly');
    const [chartData, setChartData] = useState({
        series: [0, 0, 0],
        options: {
            chart: {
                type: 'donut',
            },
            labels: ['Paid', 'Pending', 'Overdue'],
            colors: ['#5D87FF', '#FFAE1F', '#F44336'],
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#5D87FF',
                                formatter: () => 'Invoices'
                            },
                            value: {
                                color: '#2A3547',
                                fontSize: '20px',
                                fontWeight: '600'
                            }
                        }
                    }
                }
            }
        }
    });
    const [stats, setStats] = useState({
        paid: 0,
        pending: 0,
        overdue: 0,
        conversionRate: 0
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
        let filteredInvoices = invoices;
        
        // Filter based on time range
        if (timeRange === 'Today') {
            const todayStart = new Date(now.setHours(0, 0, 0, 0));
            filteredInvoices = invoices.filter(inv => new Date(inv.createdAt) >= todayStart);
        } else if (timeRange === 'Weekly') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            filteredInvoices = invoices.filter(inv => new Date(inv.createdAt) >= weekAgo);
        } else if (timeRange === 'Monthly') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            filteredInvoices = invoices.filter(inv => new Date(inv.createdAt) >= monthAgo);
        }

        const paid = filteredInvoices.filter(inv => inv.status === 'Paid').length;
        const pending = filteredInvoices.filter(inv => inv.status === 'Pending').length;
        const overdue = filteredInvoices.filter(inv => inv.status === 'Overdue').length;
        const total = filteredInvoices.length;
        
        // Calculate conversion rate (paid vs created)
        const conversionRate = total > 0 ? Math.round((paid / total) * 100) : 0;

        setStats({
            paid,
            pending,
            overdue,
            conversionRate
        });

        setChartData(prev => ({
            ...prev,
            series: [paid, pending, overdue]
        }));
    };

    const getTimeRangeLabel = () => {
        switch(timeRange) {
            case 'Today': return 'today';
            case 'Weekly': return 'this week';
            case 'Monthly': return 'this month';
            case 'Yearly': return 'this year';
            default: return '';
        }
    };

    return (
        <div className="col-xxl-3 col-xl-6">
            <div className="card h-100 radius-8 border-0 overflow-hidden">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg">Payment Trends</h6>
                        <div className="">
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
                    </div>

                    {loading ? (
                        <div className="text-center py-4">Loading payment trends...</div>
                    ) : (
                        <>
                            <ReactApexChart 
                                options={chartData.options} 
                                series={chartData.series} 
                                type="donut" 
                                height={264} 
                            />
                            
                            <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                                <li className="d-flex align-items-center gap-2">
                                    <span className="w-12-px h-12-px radius-2 bg-primary-600" />
                                    <span className="text-secondary-light text-sm fw-normal">
                                        Paid:
                                        <span className="text-primary-light fw-semibold"> {stats.paid}</span>
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <span className="w-12-px h-12-px radius-2 bg-yellow" />
                                    <span className="text-secondary-light text-sm fw-normal">
                                        Conversion:
                                        <span className="text-primary-light fw-semibold"> {stats.conversionRate}%</span>
                                    </span>
                                </li>
                            </ul>

                            <div className="mt-3 p-3 bg-light-primary rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <Icon icon="mdi:lightbulb-on" className="text-warning" />
                                    <small className="text-muted">
                                        {stats.conversionRate >= 70 ? (
                                            "Great payment conversion! Keep it up!"
                                        ) : stats.conversionRate >= 40 ? (
                                            "Good payment rate. Try following up on pending invoices."
                                        ) : (
                                            "Consider implementing payment reminders to improve conversion."
                                        )}
                                    </small>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoicePaymentTrends;