import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getCurrentUser } from '../services/authService';

const TransactionAddLayer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        type: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        merchantCategory: '',
        merchantCountry: '',
        paymentMethod: ''
    });
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }
        
        // Fetch companies
        fetchCompanies();
        
        // Fetch current user details
        getCurrentUser().then(user => {
            if (!user) {
                navigate('/signin');
            } else {
                setCurrentUser(user);
            }
        }).catch(error => {
            console.error('Error getting current user:', error);
            navigate('/signin');
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
            toast.error('Failed to fetch companies. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error('User information not available');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Validate required fields
            if (!formData.company || !formData.type || !formData.category || !formData.amount || !formData.date) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Prepare payload
            const payload = {
                company: formData.company,
                type: formData.type,
                category: formData.category,
                amount: parseFloat(formData.amount),
                date: formData.date,  
                description: formData.description,
                merchantCategory: formData.merchantCategory || 'unknown',
                merchantCountry: formData.merchantCountry || 'unknown',
                paymentMethod: formData.paymentMethod || 'unknown',
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

            if (response.data.success) {
                toast.success('Transaction added successfully!');
                navigate('/transaction-list');
            } else {
                toast.error(response.data.message || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            toast.error('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">Add Transaction</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Company</label>
                                <select
                                    className="form-select"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Company</option>
                                    {companies.map(company => (
                                        <option key={company._id} value={company._id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Amount (DT)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Merchant Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="merchantCategory"
                                    value={formData.merchantCategory}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Restaurant, Grocery, etc."
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Merchant Country</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="merchantCountry"
                                    value={formData.merchantCountry}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Tunisia, France, etc."
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Payment Method</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Credit Card, Debit Card, Cash"
                                />
                            </div>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionAddLayer;