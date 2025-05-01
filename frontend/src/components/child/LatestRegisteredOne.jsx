import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RecentInvoicesTable = () => {
    const [activeTab, setActiveTab] = useState('recent');
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [overdueInvoices, setOverdueInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/myinvoices`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const invoices = response.data;
            
            // Sort by creation date and get 5 most recent
            const sortedRecent = [...invoices]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
            
            // Get overdue invoices (status overdue or due date passed)
            const now = new Date();
            const sortedOverdue = invoices.filter(invoice => {
                return invoice.status === 'Overdue' || 
                      (invoice.status === 'Pending' && new Date(invoice.dueDate) < now);
            }).slice(0, 5);

            setRecentInvoices(sortedRecent);
            setOverdueInvoices(sortedOverdue);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Failed to load invoices");
            setLoading(false);
        }
    };

    const getStatusBadge = (status, dueDate) => {
        const now = new Date();
        const isOverdue = status === 'Pending' && new Date(dueDate) < now;
        const actualStatus = isOverdue ? 'Overdue' : status;

        const statusClasses = {
            'Paid': 'bg-success-focus text-success-main',
            'Pending': 'bg-warning-focus text-warning-main',
            'Overdue': 'bg-danger-focus text-danger-main'
        };

        return (
            <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${statusClasses[actualStatus]}`}>
                {actualStatus}
                {isOverdue && <Icon icon="mdi:alert-circle" className="ms-1" />}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="col-xxl-9 col-xl-12">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex flex-wrap align-items-center gap-1 justify-content-between mb-16">
                        <ul
                            className="nav border-gradient-tab nav-pills mb-0"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link d-flex align-items-center ${activeTab === 'recent' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('recent')}
                                >
                                    Recent Invoices
                                    <span className="text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert">
                                        {recentInvoices.length}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link d-flex align-items-center ${activeTab === 'overdue' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('overdue')}
                                >
                                    Overdue Invoices
                                    <span className="text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert">
                                        {overdueInvoices.length}
                                    </span>
                                </button>
                            </li>
                        </ul>
                        <Link
                            to="/invoice-list"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">Loading invoices...</div>
                    ) : (
                        <div className="table-responsive scroll-sm">
                            <table className="table bordered-table sm-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Client</th>
                                        <th scope="col">Invoice #</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Due Date</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col" className="text-center">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeTab === 'recent' ? recentInvoices : overdueInvoices).map((invoice) => (
                                        <tr key={invoice._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden bg-light-primary d-flex align-items-center justify-content-center">
                                                        <Icon icon="mdi:user" className="text-primary" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            {invoice.clientName}
                                                        </h6>
                                                        <span className="text-sm text-secondary-light fw-medium">
                                                            {invoice.clientEmail}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-primary fw-medium">
                                                    #{invoice._id.slice(-6).toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{formatDate(invoice.createdAt)}</td>
                                            <td>{formatDate(invoice.dueDate)}</td>
                                            <td className="fw-semibold">
                                                {formatCurrency(invoice.totalAmount || 0)}
                                            </td>
                                            <td className="text-center">
                                                {getStatusBadge(invoice.status, invoice.dueDate)}
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'overdue' && overdueInvoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No overdue invoices found
                                            </td>
                                        </tr>
                                    )}
                                    {activeTab === 'recent' && recentInvoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No invoices found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentInvoicesTable;