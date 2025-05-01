import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

const EditTaxComplianceLayer = () => {
    const [formData, setFormData] = useState({
        company: '',
        taxYear: '',
        taxAmount: '',
        dueDate: '',
        status: 'Pending'
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [companiesRes, taxRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/companies/getallcompanies`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/taxes/gettax/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setCompanies(companiesRes.data);

                const { company, taxYear, taxAmount, dueDate, status } = taxRes.data;
                setFormData({
                    company: company?._id,
                    taxYear,
                    taxAmount,
                    dueDate: dueDate.slice(0, 10),
                    status
                });

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load tax compliance data');
            }
        };

        fetchData();
    }, [id]);

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
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/taxes/updatetax/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                navigate('/taxcompliance-list');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update tax compliance';
            setError(errorMessage);
            console.error('Tax compliance updating error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-8 col-lg-10">
                        <div className="card border">
                            <div className="card-body">
                                <h6 className="text-md text-primary-light mb-16">Edit Tax Compliance</h6>
                                {error && (
                                    <div className="alert alert-danger mb-3">
                                        <Icon icon="mdi:alert-circle" className="me-2" />
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    {/* Company */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Company <span className="text-danger-600">*</span>
                                        </label>
                                        <select
                                            className="form-control radius-8 form-select"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select Company</option>
                                            {companies.map(comp => (
                                                <option key={comp._id} value={comp._id}>
                                                    {comp.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tax Year */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Tax Year <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control radius-8"
                                            name="taxYear"
                                            value={formData.taxYear}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Tax Amount */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Tax Amount <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control radius-8"
                                            name="taxAmount"
                                            value={formData.taxAmount}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Due Date <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control radius-8"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Status <span className="text-danger-600">*</span>
                                        </label>
                                        <select
                                            className="form-control radius-8 form-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Filed">Filed</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                            onClick={() => navigate('/taxcompliance-list')}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Icon icon="mdi:loading" className="animate-spin me-2" />
                                                    Updating...
                                                </>
                                            ) : 'Update'}
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

export default EditTaxComplianceLayer;
