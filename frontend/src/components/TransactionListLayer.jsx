import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link, /*useNavigate*/ } from 'react-router-dom';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:5000/api/transactions/getalltransactions');
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

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            axios.delete(`http://localhost:5000/api/transactions/deletetransaction/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        fetchTransactions();
                    } else {
                        console.error('Error deleting transaction:', response.data.message);
                        alert('Failed to delete transaction');
                    }
                })
                .catch((error) => {
                    console.error('Error deleting transaction:', error);
                    alert('Failed to delete transaction');
                });
        }
    };

    const handleEdit = (transactionId) => {
        setEditingTransaction(transactionId);
    };

    const handleSave = async (transactionId, updatedTransaction) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/transactions/updatetransaction/${transactionId}`, updatedTransaction);
            if (response.data.success) {
                fetchTransactions();
                setEditingTransaction(null);
            } else {
                console.error('Error updating transaction:', response.data.message);
                alert('Failed to update transaction');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Failed to update transaction');
        }
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    const handleExpand = (transactionId) => {
        setExpandedTransaction(transactionId === expandedTransaction ? null : transactionId);
    };

    return (
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
            <div className="card-body">
                <table className="table bordered-table mb-0">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
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
                                                {editingTransaction === transaction._id ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleSave(transaction._id, transaction)}
                                                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="lucide:check" />
                                                        </button>
                                                        <button 
                                                            onClick={handleCancelEdit}
                                                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <Icon icon="mingcute:close-line" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleEdit(transaction._id)}
                                                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                    >
                                                        <Icon icon="lucide:edit" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(transaction._id)}
                                                    className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                >
                                                    <Icon icon="mingcute:delete-2-line" />
                                                </button>
                                            </div>
                                        </td>
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
    );
};

export default TransactionListLayer;