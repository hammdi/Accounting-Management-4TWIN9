import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransactionAddLayer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        type: 'Income',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/transactions/addtransaction', formData);
            navigate('/transaction-list');
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                        onClick={() => navigate('/transaction-list')}
                    >
                        <Icon icon="mdi:arrow-left" className="text-xl" />
                        Back
                    </button>
                </div>
            </div>
            <div className="card-body py-40">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="shadow-4 border radius-8">
                            <div className="p-20 border-bottom">
                                <h3 className="text-xl">New Transaction</h3>
                            </div>
                            <div className="py-28 px-20">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Company</label>
                                            <select
                                                className="form-select"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Company</option>
                                                {/* Add company options dynamically */}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Type</label>
                                            <select
                                                className="form-select"
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="Income">Income</option>
                                                <option value="Expense">Expense</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Amount (DT)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary-600"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Icon icon="mdi:loading" className="animate-spin" /> Saving...
                                                </>
                                            ) : (
                                                'Save Transaction'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionAddLayer;