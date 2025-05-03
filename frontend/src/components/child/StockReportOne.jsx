import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CompanyPayrollReport = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payrolls/getallpayrolls`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setPayrollData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching payroll data");
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, []);

    const processCompanyData = () => {
        const companyMap = new Map();
        
        payrollData.forEach(payroll => {
            if (payroll.company) {
                const companyId = payroll.company._id || payroll.company;
                const companyName = payroll.company.name || 'Unknown Company';
                
                if (!companyMap.has(companyId)) {
                    companyMap.set(companyId, {
                        name: companyName,
                        totalSalary: payroll.salary || 0,
                        payrollCount: 1,
                        paidCount: payroll.status === 'Paid' ? 1 : 0
                    });
                } else {
                    const existing = companyMap.get(companyId);
                    existing.totalSalary += payroll.salary || 0;
                    existing.payrollCount += 1;
                    if (payroll.status === 'Paid') {
                        existing.paidCount += 1;
                    }
                }
            }
        });

        return Array.from(companyMap.values())
            .sort((a, b) => b.totalSalary - a.totalSalary)
            .slice(0, 5); // Top 5 companies by total salary
    };

    const getProgressBarClass = (percentage) => {
        if (percentage === 0) return 'bg-secondary-light';
        if (percentage < 30) return 'bg-danger-main';
        if (percentage < 70) return 'bg-warning-main';
        return 'bg-success-main';
    };

    const getStockText = (percentage) => {
        if (percentage === 0) return 'No Payments';
        if (percentage < 30) return 'Low Payments';
        if (percentage < 70) return 'Medium Payments';
        return 'High Payments';
    };

    if (loading) return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-body d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:loading" className="animate-spin text-4xl" />
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-body text-danger">{error}</div>
            </div>
        </div>
    );

    const companyData = processCompanyData();

    return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Company Payroll Report</h6>
                        <Link
                            to="/payrolls"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                        </Link>
                    </div>
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Company</th>
                                    <th scope="col">Total Salary</th>
                                    <th scope="col">
                                        <div className="max-w-112 mx-auto">
                                            <span>Payment Status</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyData.length > 0 ? (
                                    companyData.map((company, index) => {
                                        const paidPercentage = (company.paidCount / company.payrollCount) * 100;
                                        return (
                                            <tr key={index}>
                                                <td>{company.name}</td>
                                                <td>${company.totalSalary.toLocaleString()}</td>
                                                <td>
                                                    <div className="max-w-112 mx-auto">
                                                        <div className="w-100">
                                                            <div
                                                                className="progress progress-sm rounded-pill"
                                                                role="progressbar"
                                                                aria-label="Payment status"
                                                                aria-valuenow={paidPercentage}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className={`progress-bar rounded-pill ${getProgressBarClass(paidPercentage)}`}
                                                                    style={{ width: `${paidPercentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <span className="mt-12 text-secondary-light text-sm fw-medium">
                                                            {Math.round(paidPercentage)}% {getStockText(paidPercentage)}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">
                                            No company payroll data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyPayrollReport;