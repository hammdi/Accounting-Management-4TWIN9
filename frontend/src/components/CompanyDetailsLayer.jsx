import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from 'react-router-dom';

const CompanyDetailsLayer = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch company data
  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/companies/getcompany/${id}`);
      setCompany(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch company');
      toast.error('Failed to fetch company');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-danger">
        {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-4 text-muted">
        Company not found
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Company Details</h5>
              <div>
                <Link to={`/company/${id}/edit`} className="btn btn-warning me-2">
                  <Icon icon="mdi:pencil" className="me-2" />
                  Edit
                </Link>
                <Link to="/my-companies" className="btn btn-secondary">
                  <Icon icon="mdi:arrow-left" className="me-2" />
                  Back
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="text-muted">Company Name</label>
                    <h4 className="mb-0">{company.name}</h4>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted">Tax Number</label>
                    <p className="mb-0">{company.taxNumber}</p>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted">Status</label>
                    <span className={`badge bg-${company.status.toLowerCase()}`}>
                      {company.status}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="text-muted">Address</label>
                    <p className="mb-0">{company.address}</p>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted">Phone Number</label>
                    <p className="mb-0">{company.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsLayer;
