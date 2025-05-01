import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvoiceStats = () => {
    const [stats, setStats] = useState({
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        totalRevenue: 0,
        last30DaysRevenue: 0
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
            const now = new Date();
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            
            const total = invoices.length;
            const paid = invoices.filter(inv => inv.status === 'Paid').length;
            const pending = invoices.filter(inv => inv.status === 'Pending').length;
            const overdue = invoices.filter(inv => inv.status === 'Overdue').length;
            
            const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
            
            const recentInvoices = invoices.filter(inv => new Date(inv.createdAt) > thirtyDaysAgo);
            const last30DaysRevenue = recentInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
            
            setStats({
                totalInvoices: total,
                paidInvoices: paid,
                pendingInvoices: pending,
                overdueInvoices: overdue,
                totalRevenue,
                last30DaysRevenue
            });
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoice stats:", error);
            toast.error("Failed to load invoice statistics");
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return <div className="text-center py-4">Loading invoice statistics...</div>;
    }

    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
            {/* Total Invoices */}
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Invoices</p>
                                <h6 className="mb-0">{stats.totalInvoices}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:file-document-multiple"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
                            All invoices in your account
                        </p>
                    </div>
                </div>
            </div>

            {/* Paid Invoices */}
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Paid Invoices</p>
                                <h6 className="mb-0">{stats.paidInvoices}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:check-circle"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
    {`${Math.round((stats.paidInvoices / stats.totalInvoices) * 100 || 0)}% of total`}
</p>
                    </div>
                </div>
            </div>

            {/* Pending Invoices */}
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Pending Invoices</p>
                                <h6 className="mb-0">{stats.pendingInvoices}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:clock"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
    {`${Math.round((stats.pendingInvoices / stats.totalInvoices) * 100 || 0)}% of total`}
</p>
                    </div>
                </div>
            </div>

            {/* Overdue Invoices */}
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-4 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Overdue Invoices</p>
                                <h6 className="mb-0">{stats.overdueInvoices}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-danger rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:alert-circle"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
    {`${Math.round((stats.overdueInvoices / stats.totalInvoices) * 100 || 0)}% of total`}
</p>
                    </div>
                </div>
            </div>

            {/* Total Revenue */}
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-5 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Revenue</p>
                                <h6 className="mb-0">{formatCurrency(stats.totalRevenue)}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:cash-multiple"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> 
                                {formatCurrency(stats.last30DaysRevenue)}
                            </span>
                            Last 30 days revenue
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceStats;