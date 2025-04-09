import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCurrentUser } from "../services/authService";

const CompanyLayer = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        taxNumber: '',
        address: '',
        phone: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please wait for user data to load');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            // Format phone number to Tunisian international format
            const formattedPhone = `+216${formData.phone.replace(/\D/g, '')}`;
            
            // Create the request payload with formatted phone number and owner
            const payload = {
                ...formData,
                phone: formattedPhone,
                owner: user._id
            };

            await axios.post(`${process.env.REACT_APP_API_URL}/api/companies/addcompany`, payload);
            toast.success('Company created successfully!');
            setFormData({
                name: '',
                taxNumber: '',
                address: '',
                phone: '',
                status: 'Active'
            });
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'An error occurred');
            toast.error('Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error('Failed to fetch user data');
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden">
            <div className="card-body p-40">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="name"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Company Name <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="taxNumber"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Tax Number <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="taxNumber"
                                    name="taxNumber"
                                    value={formData.taxNumber}
                                    onChange={handleChange}
                                    placeholder="Enter tax number"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="address"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Address <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter company address"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="phone"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Phone Number <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    className="form-control radius-8"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="status"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Status
                                </label>
                                <select
                                    className="form-control radius-8 form-select"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}
                    <div className="mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary radius-8"
                            disabled={loading || !user}
                        >
                            {loading ? 'Creating...' : 'Create Company'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyLayer;