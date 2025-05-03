import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CompanyStatusWidget = () => {
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchCompanyStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const active = response.data.filter(c => c.status === 'Active').length;
      const inactive = response.data.length - active;

      setStats({
        active,
        inactive,
        total: response.data.length
      });
    } catch (error) {
      toast.error('Failed to load company data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const StatusItem = ({ count, label, colorClass }) => (
    <div className="d-flex align-items-center mb-12">
      <div className={`w-12-px h-12-px rounded-circle ${colorClass} me-8`}></div>
      <div className="flex-grow-1">
        <span className="text-sm text-secondary-light">{label}</span>
      </div>
      <span className="fw-semibold">{count}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="col-xxl-4 col-md-6">
        <div className="card h-100">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-xxl-4 col-md-6">
      <div className="card h-100">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Company Status</h6>
            <Link to="/companies" className="text-primary-600 hover-text-primary">
              <Icon icon="solar:alt-arrow-right-linear" />
            </Link>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="mb-0">{stats.total}</h3>
            <span className="badge bg-primary-50 text-primary-600">Total</span>
          </div>

          <StatusItem 
            count={stats.active} 
            label="Active Companies" 
            colorClass="bg-success" 
          />
          <StatusItem 
            count={stats.inactive} 
            label="Inactive Companies" 
            colorClass="bg-danger" 
          />

          <div className="mt-20 pt-20 border-top">
            <div className="d-flex justify-content-between">
              <span className="text-sm text-secondary-light">Last updated</span>
              <span className="text-sm fw-medium">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatusWidget;