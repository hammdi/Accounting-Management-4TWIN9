import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransactionListLayer = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [page, pageSize, searchTerm, statusFilter]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transactions/getalltransactions');
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
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
        // implement delete logic here
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
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction, index) => (
                                <tr key={transaction._id}>
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
                                                onClick={() => navigate(`/transaction-preview/${transaction._id}`)}
                                                className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                            >
                                                <Icon icon="iconamoon:eye-light" />
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/transaction-edit/${transaction._id}`)}
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionListLayer;