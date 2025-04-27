import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const PayrollListLayer = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState('employee');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayrolls = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payrolls/getallpayrolls`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPayrolls(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching payrolls");
                console.error("Error fetching payrolls:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayrolls();
    }, []);

    const handleDelete = async (payrollId) => {
        if (!window.confirm("Are you sure you want to delete this payroll?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/payrolls/deletepayroll/${payrollId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPayrolls(payrolls.filter(payroll => payroll._id !== payrollId));
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting payroll");
            console.error("Error deleting payroll:", error);
        }
    };

    const sortPayrolls = (payrolls, sortBy, sortOrder) => {
        return [...payrolls].sort((a, b) => {
            let compareA, compareB;
            
            if (sortBy === 'employee') {
                compareA = a.employee?.name?.toLowerCase() || '';
                compareB = b.employee?.name?.toLowerCase() || '';
            } else if (sortBy === 'salary') {
                compareA = a.salary || 0;
                compareB = b.salary || 0;
            } else if (sortBy === 'date') {
                compareA = new Date(a.paymentDate || 0);
                compareB = new Date(b.paymentDate || 0);
            } else if (sortBy === 'status') {
                compareA = a.status?.toLowerCase() || '';
                compareB = b.status?.toLowerCase() || '';
            }
            
            return sortOrder === 'asc' 
                ? compareA < compareB ? -1 : compareA > compareB ? 1 : 0
                : compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
        });
    };

    const filteredPayrolls = payrolls.filter((payroll) =>
        (payroll.employee?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (payroll.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (payroll.company?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (payroll.salary?.toString() || '').includes(searchTerm)
    );

    const sortedPayrolls = sortPayrolls(filteredPayrolls, sortBy, sortOrder);
    const pageCount = Math.ceil(sortedPayrolls.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedPayrolls = sortedPayrolls.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <select 
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {[5, 10, 15, 20, 25].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search payrolls..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Icon icon="ion:search-outline" className="icon"/>
                    </form>
                    <select 
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="employee">Sort by Employee</option>
                        <option value="salary">Sort by Salary</option>
                        <option value="date">Sort by Date</option>
                        <option value="status">Sort by Status</option>
                    </select>
                    <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        <Icon 
                            icon={sortOrder === 'asc' ? "mdi:sort-ascending" : "mdi:sort-descending"} 
                            className="icon"
                        />
                    </button>
                </div>
                <Link
                    to="/add-payroll"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                    Add New Payroll
                </Link>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Payment Date</th>
                                <th scope="col">Employee</th>
                                <th scope="col">Company</th>
                                <th scope="col">Salary</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedPayrolls.map((payroll) => (
                                <tr key={payroll._id}>
                                    <td>
                                        {new Date(payroll.paymentDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td>{payroll.employee?.name || 'N/A'}</td>
                                    <td>{payroll.company?.name || 'N/A'}</td>
                                    <td>${payroll.salary?.toLocaleString() || '0'}</td>
                                    <td className="text-center">
                                        <span className={`px-24 py-4 radius-4 fw-medium text-sm border 
                                            ${payroll.status === "Paid" ? "bg-success-focus text-success-600 border-success-main" : "bg-warning-focus text-warning-600 border-warning-main"}`}>
                                            {payroll.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex align-items-center gap-10 justify-content-center">
                                            <button
                                                type="button"
                                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => navigate(`/edit-payroll/${payroll._id}`)}
                                            >
                                                <Icon icon="lucide:edit" className="menu-icon"/>
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => handleDelete(payroll._id)}
                                            >
                                                <Icon icon="fluent:delete-24-regular" className="menu-icon"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPayrolls.length === 0 && (
                        <div className="text-center py-4">
                            <p>No payroll records found</p>
                        </div>
                    )}
                </div>
                {filteredPayrolls.length > 0 && (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayrolls.length)} of {filteredPayrolls.length} entries
                        </span>
                        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            <li className="page-item">
                                <button
                                    className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <Icon icon="ep:d-arrow-left" />
                                </button>
                            </li>
                            {[...Array(pageCount)].map((_, index) => (
                                <li key={index} className="page-item">
                                    <button
                                        className={`page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
                                            index + 1 === currentPage ? 'bg-primary-600 text-white' : 'bg-neutral-200'
                                        }`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item">
                                <button
                                    className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pageCount}
                                >
                                    <Icon icon="ep:d-arrow-right" />
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollListLayer;