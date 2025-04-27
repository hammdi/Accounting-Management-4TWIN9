import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const TaxComplianceListLayer = () => {
    const [taxes, setTaxes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState('company');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTaxes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taxes/getalltaxes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTaxes(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching tax compliances");
                console.error("Error fetching taxes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxes();
    }, []);

    const handleDelete = async (taxId) => {
        if (!window.confirm("Are you sure you want to delete this tax compliance?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/taxes/deletetax/${taxId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTaxes(taxes.filter(tax => tax._id !== taxId));
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting tax compliance");
            console.error("Error deleting tax:", error);
        }
    };

    const sortTaxes = (taxes, sortBy, sortOrder) => {
        return [...taxes].sort((a, b) => {
            let compareA, compareB;
            
            if (sortBy === 'company') {
                compareA = a.company?.name?.toLowerCase() || '';
                compareB = b.company?.name?.toLowerCase() || '';
            } else if (sortBy === 'taxYear') {
                compareA = a.taxYear || 0;
                compareB = b.taxYear || 0;
            } else if (sortBy === 'taxAmount') {
                compareA = a.taxAmount || 0;
                compareB = b.taxAmount || 0;
            } else if (sortBy === 'status') {
                compareA = a.status?.toLowerCase() || '';
                compareB = b.status?.toLowerCase() || '';
            }
            
            return sortOrder === 'asc' 
                ? compareA < compareB ? -1 : compareA > compareB ? 1 : 0
                : compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
        });
    };

    const filteredTaxes = taxes.filter((tax) =>
        (tax.company?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tax.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tax.taxYear?.toString() || '').includes(searchTerm) ||
        (tax.taxAmount?.toString() || '').includes(searchTerm)
    );

    const sortedTaxes = sortTaxes(filteredTaxes, sortBy, sortOrder);
    const pageCount = Math.ceil(sortedTaxes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTaxes = sortedTaxes.slice(startIndex, startIndex + itemsPerPage);

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
                            placeholder="Search tax compliances..."
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
                        <option value="company">Sort by Company</option>
                        <option value="taxYear">Sort by Tax Year</option>
                        <option value="taxAmount">Sort by Tax Amount</option>
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
                    to="/add-taxcompliance"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                    Add New Tax Compliance
                </Link>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Due Date</th>
                                <th scope="col">Company</th>
                                <th scope="col">Tax Year</th>
                                <th scope="col">Tax Amount</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedTaxes.map((tax) => (
                                <tr key={tax._id}>
                                    <td>
                                        {new Date(tax.dueDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td>{tax.company?.name || 'N/A'}</td>
                                    <td>{tax.taxYear}</td>
                                    <td>${tax.taxAmount?.toLocaleString() || '0'}</td>
                                    <td className="text-center">
                                        <span className={`px-24 py-4 radius-4 fw-medium text-sm border 
                                            ${tax.status === "Filed" ? "bg-success-focus text-success-600 border-success-main" : "bg-warning-focus text-warning-600 border-warning-main"}`}>
                                            {tax.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex align-items-center gap-10 justify-content-center">
                                            <button
                                                type="button"
                                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => navigate(`/edit-taxcompliance/${tax._id}`)}
                                            >
                                                <Icon icon="lucide:edit" className="menu-icon"/>
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => handleDelete(tax._id)}
                                            >
                                                <Icon icon="fluent:delete-24-regular" className="menu-icon"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTaxes.length === 0 && (
                        <div className="text-center py-4">
                            <p>No tax compliance records found</p>
                        </div>
                    )}
                </div>
                {filteredTaxes.length > 0 && (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTaxes.length)} of {filteredTaxes.length} entries
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

export default TaxComplianceListLayer;
