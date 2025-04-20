import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {getCurrentUser} from "../services/authService";

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
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch companies for dropdown
        fetchCompanies();
        // Get current user
        getCurrentUser().then(user => {
            if (!user) {
                navigate('/signin');
            } else {
                setCurrentUser(user);
            }
        });
    }, [navigate]);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/getallcompanies`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            alert('Failed to fetch companies. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.company) {
            newErrors.company = 'Company is required';
        }
        
        if (!formData.type) {
            newErrors.type = 'Transaction type is required';
        }
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than zero';
        }
        
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        
        if (formData.category.length > 100) {
            newErrors.category = 'Category must not exceed 100 characters';
        }
        
        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must not exceed 500 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            const token = localStorage.getItem('token');
            // Ensure amount is a number and all required fields are present
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                createdBy: currentUser._id
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/transactions/addtransaction`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            // Debug: log response for troubleshooting
            console.log('Add transaction response:', response.data);
            if (response.data.success) {
                alert('Transaction added successfully!');
                navigate('/transaction-list');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert(error.message || 'Failed to add transaction. Please try again.');
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
                                                className={`form-select ${errors.company ? 'is-invalid' : ''}`}
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(company => (
                                                    <option key={company._id} value={company._id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.company && (
                                                <div className="invalid-feedback">
                                                    {errors.company}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Type</label>
                                            <select
                                                className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="Income">Income</option>
                                                <option value="Expense">Expense</option>
                                            </select>
                                            {errors.type && (
                                                <div className="invalid-feedback">
                                                    {errors.type}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Amount (DT)</label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                required
                                                min="0.01"
                                                step="0.01"
                                            />
                                            {errors.amount && (
                                                <div className="invalid-feedback">
                                                    {errors.amount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Category</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.category && (
                                                <div className="invalid-feedback">
                                                    {errors.category}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.date && (
                                                <div className="invalid-feedback">
                                                    {errors.date}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="3"
                                            ></textarea>
                                            {errors.description && (
                                                <div className="invalid-feedback">
                                                    {errors.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Adding...' : 'Add Transaction'}
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