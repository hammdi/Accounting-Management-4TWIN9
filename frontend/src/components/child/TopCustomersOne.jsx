import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TopEmployeesBySalary = () => {
    const [topEmployees, setTopEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopEmployees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payrolls/getallpayrolls`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Traiter les données pour obtenir les employés avec les salaires les plus élevés
                const employeesMap = new Map();
                
                response.data.forEach(payroll => {
                    if (payroll.employee) {
                        const employeeId = payroll.employee._id || payroll.employee;
                        if (!employeesMap.has(employeeId)) {
                            employeesMap.set(employeeId, {
                                employee: payroll.employee,
                                highestSalary: payroll.salary,
                                payrollCount: 1
                            });
                        } else {
                            const existing = employeesMap.get(employeeId);
                            if (payroll.salary > existing.highestSalary) {
                                existing.highestSalary = payroll.salary;
                            }
                            existing.payrollCount++;
                        }
                    }
                });

                // Trier par salaire le plus élevé et prendre les 5 premiers
                const sortedEmployees = Array.from(employeesMap.values())
                    .sort((a, b) => b.highestSalary - a.highestSalary)
                    .slice(0, 5);

                setTopEmployees(sortedEmployees);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching employee data");
                setLoading(false);
            }
        };

        fetchTopEmployees();
    }, []);

    if (loading) return (
        <div className="col-xxl-4 col-lg-6">
            <div className="card h-100">
                <div className="card-body d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:loading" className="animate-spin text-4xl" />
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="col-xxl-4 col-lg-6">
            <div className="card h-100">
                <div className="card-body text-danger">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="col-xxl-4 col-lg-6">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Top Employees by Salary</h6>
                        <Link
                            to="/payrolls"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                        </Link>
                    </div>
                    <div className="mt-32">
                        {topEmployees.length > 0 ? (
                            topEmployees.map((employeeData, index) => (
                                <div className="d-flex align-items-center justify-content-between gap-3 mb-32" key={index}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="w-40-px h-40-px radius-8 flex-shrink-0 bg-primary-light text-primary-600 d-flex justify-content-center align-items-center">
                                            <Icon icon="ion:person" className="icon" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="text-md mb-0 fw-normal">
                                                {employeeData.employee.name || 'Unknown Employee'}
                                            </h6>
                                            <span className="text-sm text-secondary-light fw-normal">
                                                {employeeData.employee.email || 'No email'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-primary-light text-md fw-medium">
                                        ${employeeData.highestSalary?.toLocaleString() || '0'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">No employee data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopEmployeesBySalary;