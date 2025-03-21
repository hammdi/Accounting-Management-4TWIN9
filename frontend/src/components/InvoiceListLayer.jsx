import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceListLayer = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [editingStatus, setEditingStatus] = useState(null);
    const [expandedInvoice, setExpandedInvoice] = useState(null);

    // Fetch invoices from API
    useEffect(() => {
        fetchInvoices();
    }, [statusFilter, currentPage, entriesPerPage]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/invoices/getallinvoice');

            // Apply filters
            let filteredData = response.data;

            if (statusFilter) {
                filteredData = filteredData.filter(invoice => invoice.status === statusFilter);
            }

            setTotalInvoices(filteredData.length);

            // Apply pagination
            const startIndex = (currentPage - 1) * entriesPerPage;
            const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(entriesPerPage));

            setInvoices(paginatedData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching invoices:", err);
            setError("Failed to load invoices. Please try again later.");
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter invoices based on search term
    const filteredInvoices = invoices.filter(invoice =>
        invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value === 'Select Status' ? '' : e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Handle entries per page change
    const handleEntriesPerPageChange = (e) => {
        setEntriesPerPage(e.target.value);
        setCurrentPage(1); // Reset to first page when entries per page changes
    };

    // Handle pagination
    const totalPages = Math.ceil(totalInvoices / entriesPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle checkbox selection
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(invoices.map(invoice => invoice._id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectInvoice = (id) => {
        if (selectedInvoices.includes(id)) {
            setSelectedInvoices(selectedInvoices.filter(invoiceId => invoiceId !== id));
        } else {
            setSelectedInvoices([...selectedInvoices, id]);
        }
    };

    // Handle view invoice
    const handleViewInvoice = (id) => {
        setExpandedInvoice(id === expandedInvoice ? null : id);
    };

    // Handle edit invoice
    const handleEditInvoice = (id) => {
        navigate(`/invoice-edit/${id}`);
    };

    // Handle delete invoice
    const handleDeleteInvoice = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/invoices/deleteinvoice/${id}`);
                // Refresh the invoice list
                fetchInvoices();
            } catch (err) {
                console.error("Error deleting invoice:", err);
                alert("Failed to delete invoice. Please try again.");
            }
        }
    };

    const handleStatusChange = async (invoiceId, newStatus) => {
        try {
            // Get the current invoice data
            const currentInvoice = invoices.find(inv => inv._id === invoiceId);
            if (!currentInvoice) return;

            await axios.put(`${process.env.REACT_APP_API_URL}/api/invoices/updateinvoice/${invoiceId}`, {
                clientName: currentInvoice.clientName,
                clientEmail: currentInvoice.clientEmail,
                clientPhone: currentInvoice.clientPhone,
                dueDate: currentInvoice.dueDate,
                status: newStatus,
                items: currentInvoice.items || [],
                subtotal: currentInvoice.subtotal || 0,
                discount: currentInvoice.discount || 0,
                taxAmount: currentInvoice.taxAmount || 0,
                totalAmount: currentInvoice.totalAmount || 0
            });

            // Update the local state
            setInvoices(invoices.map(invoice => 
                invoice._id === invoiceId ? { ...invoice, status: newStatus } : invoice
            ));
            setEditingStatus(null);
        } catch (err) {
            console.error("Error updating invoice status:", err);
            alert("Failed to update invoice status. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Overdue':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="card">
            <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <span>Show</span>
                        <select
                            className="form-select form-select-sm w-auto"
                            value={entriesPerPage}
                            onChange={handleEntriesPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className="icon-field">
                        <input
                            type="text"
                            name="search"
                            className="form-control form-control-sm w-auto"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="icon">
                            <Icon icon="ion:search-outline" />
                        </span>
                    </div>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <select
                        className="form-select form-select-sm w-auto"
                        value={statusFilter || "Select Status"}
                        onChange={handleStatusFilterChange}
                    >
                        <option value="Select Status" disabled>
                            Select Status
                        </option>
                        <option value="">All</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <Link to="/invoice-add" className="btn btn-sm btn-primary-600">
                        <i className="ri-add-line" /> Create Invoice
                    </Link>
                </div>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table bordered-table mb-0">
                            <thead>
                            <tr>
                                <th scope="col">
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="checkAll"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                        <label className="form-check-label" htmlFor="checkAll">
                                            S.L
                                        </label>
                                    </div>
                                </th>
                                <th scope="col">Invoice</th>
                                <th scope="col">Name</th>
                                <th scope="col">Issued Date</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No invoices found
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <React.Fragment key={invoice._id}>
                                        <tr>
                                            <td>
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`check${invoice._id}`}
                                                        checked={selectedInvoices.includes(invoice._id)}
                                                        onChange={() => handleSelectInvoice(invoice._id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`check${invoice._id}`}>
                                                        {String(filteredInvoices.indexOf(invoice) + 1).padStart(2, '0')}
                                                    </label>
                                                </div>
                                            </td>
                                            <td>
                                                <Link to={`/invoice-preview/${invoice._id}`} className="text-primary-600">
                                                    #{invoice._id.substring(0, 6)}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${invoice.clientName}&background=random`}
                                                        alt=""
                                                        className="flex-shrink-0 me-12 radius-8"
                                                        width="40"
                                                        height="40"
                                                    />
                                                    <h6 className="text-md mb-0 fw-medium flex-grow-1">
                                                        {invoice.clientName}
                                                    </h6>
                                                </div>
                                            </td>
                                            <td>{formatDate(invoice.createdAt)}</td>
                                            <td>{formatCurrency(invoice.totalAmount)}</td>
                                            <td>
                                                {editingStatus === invoice._id ? (
                                                    <select
                                                        className={`bg-${invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'}-focus text-${invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'}-main px-24 py-4 rounded-pill fw-medium text-sm`}
                                                        value={invoice.status}
                                                        onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                                                        onBlur={() => setEditingStatus(null)}
                                                        autoFocus
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Paid">Paid</option>
                                                        <option value="Overdue">Overdue</option>
                                                    </select>
                                                ) : (
                                                    <span 
                                                        className={`bg-${invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'}-focus text-${invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'}-main px-24 py-4 rounded-pill fw-medium text-sm cursor-pointer`}
                                                        onClick={() => setEditingStatus(invoice._id)}
                                                    >
                                                        {invoice.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleViewInvoice(invoice._id)}
                                                    className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                >
                                                    <Icon icon="iconamoon:eye-light" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditInvoice(invoice._id)}
                                                    className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                >
                                                    <Icon icon="lucide:edit" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteInvoice(invoice._id)}
                                                    className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                >
                                                    <Icon icon="mingcute:delete-2-line" />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedInvoice === invoice._id && (
                                            <tr>
                                                <td colSpan="9" className="p-4">
                                                    <div className="card border-0">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Invoice Details</h5>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p><strong>Client Name:</strong> {invoice.clientName}</p>
                                                                    <p><strong>Email:</strong> {invoice.clientEmail}</p>
                                                                    <p><strong>Phone:</strong> {invoice.clientPhone}</p>
                                                                    <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p><strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}</p>
                                                                    <p><strong>Discount:</strong> {formatCurrency(invoice.discount)}</p>
                                                                    <p><strong>Tax:</strong> {formatCurrency(invoice.taxAmount)}</p>
                                                                    <p><strong>Total:</strong> {formatCurrency(invoice.totalAmount)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3">
                                                                <h6>Items:</h6>
                                                                <ul className="list-group">
                                                                    {invoice.items?.map((item, index) => (
                                                                        <li key={index} className="list-group-item">
                                                                            {item.name} - {formatCurrency(item.price)} x {item.quantity}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                            </tbody>
                        </table>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
                            <span>Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, totalInvoices)} of {totalInvoices} entries</span>
                            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                <li className="page-item">
                                    <button
                                        className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <Icon icon="ep:d-arrow-left" className="text-xl" />
                                    </button>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                    <li className="page-item" key={page + 1}>
                                        <button
                                            className={`page-link ${currentPage === page + 1 ? 'bg-primary-600 text-white' : 'bg-primary-50 text-secondary-light'} fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px`}
                                            onClick={() => handlePageChange(page + 1)}
                                        >
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button
                                        className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <Icon icon="ep:d-arrow-right" className="text-xl" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceListLayer;
