import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const InvoiceStatusStats = () => {
    const [stats, setStats] = useState({
        paid: 0,
        pending: 0,
        overdue: 0,
        total: 0,
        dailyChange: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoiceStats();
    }, []);

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
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const paid = invoices.filter(inv => inv.status === 'Paid').length;
        const pending = invoices.filter(inv => inv.status === 'Pending').length;
        const overdue = invoices.filter(inv => inv.status === 'Overdue').length;
        const total = invoices.length;
        
        // Calculate daily change (average change over last 30 days)
        const recentInvoices = invoices.filter(inv => new Date(inv.createdAt) > thirtyDaysAgo);
        const dailyChange = Math.round(recentInvoices.length / 30);

        setStats({
            paid,
            pending,
            overdue,
            total,
            dailyChange
        });
    };

    const chartOptions = {
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
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Paid', 'Pending', 'Overdue'],
        },
        yaxis: {
            title: {
                text: 'Number of Invoices'
            }
        },
        fill: {
            opacity: 1,
            colors: ['#5D87FF', '#49BEFF', '#FFAE1F']
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " invoices";
                }
            }
        }
    };

    const chartSeries = [{
        name: 'Invoices',
        data: [stats.paid, stats.pending, stats.overdue]
    }];

    const getStatusChangeColor = () => {
        return stats.dailyChange >= 0 ? 'success' : 'danger';
    };

    const getStatusChangeIcon = () => {
        return stats.dailyChange >= 0 ? 'iconamoon:arrow-up-2-fill' : 'iconamoon:arrow-down-2-fill';
    };

    return (
        <div className="col-xxl-3 col-xl-6">
            <div className="card h-100 radius-8 border">
                <div className="card-body p-24">
                    <h6 className="mb-12 fw-semibold text-lg mb-16">Invoice Status</h6>
                    <div className="d-flex align-items-center gap-2 mb-20">
                        <h6 className="fw-semibold mb-0">{stats.total}</h6>
                        <p className="text-sm mb-0">
                            <span className={`bg-${getStatusChangeColor()}-focus border br-${getStatusChangeColor()} px-8 py-2 rounded-pill fw-semibold text-${getStatusChangeColor()}-main text-sm d-inline-flex align-items-center gap-1`}>
                                {Math.abs(stats.dailyChange)}
                                <Icon
                                    icon={getStatusChangeIcon()}
                                    className="icon"
                                />
                            </span>
                            {stats.dailyChange >= 0 ? '+' : '-'} {Math.abs(stats.dailyChange)} Per Day
                        </p>
                    </div>
                    {loading ? (
                        <div className="text-center py-4">Loading invoice stats...</div>
                    ) : (
                        <ReactApexChart 
                            options={chartOptions} 
                            series={chartSeries} 
                            type="bar" 
                            height={264} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceStatusStats;