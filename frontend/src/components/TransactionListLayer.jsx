import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link, /*useNavigate*/ } from 'react-router-dom';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';


const TransactionListLayer = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [expandedTransaction, setExpandedTransaction] = useState(null);
   // const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [page, pageSize, searchTerm, statusFilter]);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/mytransactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API Response:', response.data); // Debug
            if (response.data.success) {
                setTransactions(response.data.data || []);
            } else {
                console.error('Error fetching transactions:', response.data.message);
                setTransactions([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    // State for delete confirmation dialog
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    // Show popup for confirmation
    const handleDelete = (id) => {

        setTransactionToDelete(id);
        setShowDeleteDialog(true);
    };

    // Confirm deletion logic
    const confirmDeleteTransaction = async () => {
        if (!transactionToDelete) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/transactions/deletetransaction/${transactionToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                fetchTransactions();
                toast.success('Transaction deleted successfully');
            } else {
                toast.error(response.data.message || 'Failed to delete transaction');
            }
        } catch (error) {
            toast.error('Failed to delete transaction');
        } finally {
            setShowDeleteDialog(false);
            setTransactionToDelete(null);

        }
    };


    const handleEdit = (transactionId) => {
        setEditingTransaction(transactionId);
    };

    const handleEditChange = (e, transactionId) => {
        const { name, value } = e.target;
        setTransactions(prev => prev.map(txn =>
            txn._id === transactionId ? { ...txn, [name]: value } : txn
        ));
    };


    const handleSave = async (transactionId, updatedTransaction) => {
        try {
            const token = localStorage.getItem('token');
            // Only send fields expected by the backend
            // Validate fields
            if (!updatedTransaction.type || !updatedTransaction.category || !updatedTransaction.amount || !updatedTransaction.date) {
                toast.error('Type, category, amount, and date are required.');
                return;
            }
            // Ensure date is yyyy-mm-dd
            const formattedDate = updatedTransaction.date ? updatedTransaction.date.slice(0, 10) : '';
            const payload = {
                type: updatedTransaction.type,
                category: updatedTransaction.category,
                amount: parseFloat(updatedTransaction.amount),
                date: formattedDate,
                description: updatedTransaction.description,
                notes: updatedTransaction.notes,
                company: updatedTransaction.company, // preserve the company field
                createdBy: updatedTransaction.createdBy // preserve the createdBy field
            };
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/transactions/updatetransaction/${transactionId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            // Debug: log response for troubleshooting
            console.log('Update transaction response:', response.data);
            if (response.data.success) {
                fetchTransactions();
                setEditingTransaction(null);
                toast.success('Transaction updated successfully');
            } else {
                // Show all backend errors if present
                if (response.data.errors && Array.isArray(response.data.errors)) {
                    response.data.errors.forEach(err => toast.error(err.message));
                } else {
                    toast.error(response.data.message || 'Failed to update transaction');
                }
                console.error('Error updating transaction:', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error updating transaction:', error.response.data);
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    error.response.data.errors.forEach(err => toast.error(err.message));
                } else {
                    toast.error(error.response.data.message || 'Failed to update transaction.');
                }
            } else {
                console.error('Error updating transaction:', error);
                toast.error('Failed to update transaction.');
            }
        }
    };


    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    const handleExpand = (transactionId) => {
        setExpandedTransaction(transactionId === expandedTransaction ? null : transactionId);
    };

    return (
        <React.Fragment>
            <div className="card">
                <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span>Show</span>
                            <select 
                                className="form-select form-select-sm w-auto" 
                                value={pageSize}
                                onChange={handlePageSizeChange}
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
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <option value="">All</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                        <Link to="/transaction-add" className="btn btn-sm btn-primary-600">
                            <i className="ri-add-line" /> Add Transaction
                        </Link>
                    </div>
                </div>

                <div className="card-body" style={{overflowX: 'auto'}}>
                    <table className="table bordered-table mb-0" style={{minWidth: '900px'}}>
                        <thead>

                            <tr>
                                <th scope="col">#</th>
<th scope="col">Company</th>
<th scope="col">Type</th>
<th scope="col">Category</th>
<th scope="col">Amount</th>
<th scope="col">Date</th>
<th scope="col">Description</th>
<th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : Array.isArray(transactions) ? (
                                transactions.map((transaction, index) => (
                                    <React.Fragment key={transaction._id}>

                                    <tr>
                                        <td>{(page - 1) * pageSize + index + 1}</td>
                                        {/* Editable row fields */}
                                        {editingTransaction === transaction._id ? (
                                            <>
                                                <td>
                                                    {transaction.company && typeof transaction.company === 'object' && transaction.company.name ? (
                                                        <span>{transaction.company.name} <span className="text-muted" style={{fontSize:'0.8em'}}>({transaction.company._id || transaction.company.id || transaction.company})</span></span>
                                                    ) : (
                                                        <span className="text-warning">Unknown ({transaction.company && (transaction.company._id || transaction.company.id || transaction.company)})</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <select
                                                        name="type"
                                                        className="form-select form-select-sm"
                                                        value={transaction.type}
                                                        onChange={e => handleEditChange(e, transaction._id)}
                                                    >
                                                        <option value="Income">Income</option>
                                                        <option value="Expense">Expense</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="category"
                                                        className="form-control form-control-sm"
                                                        value={transaction.category}
                                                        onChange={e => handleEditChange(e, transaction._id)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="amount"
                                                        className="form-control form-control-sm"
                                                        value={transaction.amount}
                                                        onChange={e => handleEditChange(e, transaction._id)}
                                                        min="0.01"
                                                        step="0.01"
                                                    /> DT
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        className="form-control form-control-sm"
                                                        value={transaction.date ? transaction.date.slice(0, 10) : ''}
                                                        onChange={e => handleEditChange(e, transaction._id)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        className="form-control form-control-sm"
                                                        value={transaction.description || ''}
                                                        onChange={e => handleEditChange(e, transaction._id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 flex-nowrap">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleSave(transaction._id, transaction)}
                                                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="lucide:check" />
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="mingcute:close-line" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>
                                                    {transaction.company && typeof transaction.company === 'object' && transaction.company.name ? (
                                                        <span>{transaction.company.name} <span className="text-muted" style={{fontSize:'0.8em'}}>({transaction.company._id || transaction.company.id || transaction.company})</span></span>
                                                    ) : (
                                                        <span className="text-warning">Unknown ({transaction.company && (transaction.company._id || transaction.company.id || transaction.company)})</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${transaction.type === 'Income' ? 'bg-success' : 'bg-danger'}`}>
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td>{transaction.category}</td>
                                                <td>{transaction.amount} DT</td>
                                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                <td>{transaction.description || '-'}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            onClick={() => handleExpand(transaction._id)}
                                                            className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="iconamoon:eye-light" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleEdit(transaction._id)}
                                                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="lucide:edit" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(transaction._id)}
                                                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="mingcute:delete-2-line" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                    {expandedTransaction === transaction._id && (
                                        <tr>
                                            <td colSpan="7">
                                                <div className="card border-0">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p><strong>Transaction ID:</strong> {transaction._id}</p>
                                                                <p><strong>Type:</strong> {transaction.type}</p>
                                                                <p><strong>Category:</strong> {transaction.category}</p>
                                                                <p><strong>Amount:</strong> {transaction.amount} DT</p>
                                                                <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p><strong>Description:</strong> {transaction.description || 'N/A'}</p>
                                                                <p><strong>Notes:</strong> {transaction.notes || 'No notes added'}</p>
                                                                <p><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                                                                <p><strong>Updated At:</strong> {new Date(transaction.updatedAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
            <ToastContainer position="top-right" autoClose={3000} />
            <ConfirmDeleteDialog
                show={showDeleteDialog}
                onClose={() => { setShowDeleteDialog(false); setTransactionToDelete(null); }}
                onConfirm={confirmDeleteTransaction}
                invoiceName="this transaction"
            />
        </React.Fragment>
    );
};

export default TransactionListLayer;