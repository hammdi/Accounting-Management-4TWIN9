import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const TaxComplianceGridLayer = () => {
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
                // Set taxes directly from response data
                setTaxes(response.data || []);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching taxes");
                console.error("Error fetching taxes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaxes();
    }, []);

    /*const filteredTaxes = taxes.filter((tax) =>
        tax.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tax.taxType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tax.taxAmount.toString().includes(searchTerm) ||
        tax.dueDate?.toString().includes(searchTerm)
    );*/
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

    const filteredTaxes = taxes.filter((tax) =>
        (tax.company?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tax.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tax.taxYear?.toString() || '').includes(searchTerm) ||
        (tax.taxAmount?.toString() || '').includes(searchTerm)
    );

    const pageCount = Math.ceil(filteredTaxes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTaxes = filteredTaxes.slice(startIndex, startIndex + itemsPerPage);

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
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
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
                <div className="row gy-4">
                    {displayedTaxes.map((tax) => (
                        <div key={tax._id} className="col-xxl-3 col-md-6">
                            <div className="position-relative border radius-16 overflow-hidden">
                                <div className="bg-primary-50 p-16" style={{ height: '80px' }}>
                                    <div className="d-flex justify-content-between align-items-center h-100">
                                        <div>
                                            <h6 className="text-md mb-0">Tax Amount</h6>
                                            <span className="text-primary-600 fw-medium">
                                                ${tax.taxAmount?.toLocaleString() || '0'}
                                            </span>
                                        </div>
                                        <div className={`px-12 py-4 radius-4 fw-medium text-sm border 
                                            ${tax.status === "Filed" ? "bg-success-focus text-success-600 border-success-main" : "bg-warning-focus text-warning-600 border-warning-main"}`}>
                                            {tax.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown position-absolute top-0 end-0 me-16 mt-16">
                                    <button
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        className="bg-white-gradient-light w-32-px h-32-px radius-8 border border-light-white d-flex justify-content-center align-items-center text-white"
                                    >
                                        <Icon icon="entypo:dots-three-vertical" className="icon" />
                                    </button>
                                    <ul className="dropdown-menu p-12 border bg-base shadow">
                                        <li>
                                            <button
                                                className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                onClick={() => navigate(`/edit-taxcompliance/${tax._id}`)}
                                            >
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                onClick={() => handleDelete(tax._id)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="ps-16 pb-16 pe-16 text-center mt-16">
                                    <div className="d-flex justify-content-center">
                                        <div className="bg-primary-50 w-100-px h-100-px rounded-circle d-flex justify-content-center align-items-center">
                                            <Icon icon="mdi:file-document" className="icon text-3xl text-primary-600" />
                                        </div>
                                    </div>
                                    <h6 className="text-lg mb-0 mt-12">{tax.company?.name || 'N/A'}</h6>
                                    <span className="text-secondary-light mb-12 d-block">
                                        Tax Year: {tax.taxYear}
                                    </span>
                                    <div className="center-border position-relative bg-neutral-100 radius-8 p-12 d-flex align-items-center gap-4">
                                        <div className="text-center w-50">
                                            <h6 className="text-md mb-0">
                                                {new Date(tax.dueDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </h6>
                                            <span className="text-secondary-light text-sm mb-0">
                                                Due Date
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/taxcompliances/${tax._id}`)}
                                        className="bg-primary-50 text-primary-600 bg-hover-primary-600 hover-text-white p-10 text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center justify-content-center mt-16 fw-medium gap-2 w-100"
                                    >
                                        View Details
                                        <Icon icon="solar:alt-arrow-right-linear" className="icon text-xl line-height-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredTaxes.length === 0 && (
                    <div className="text-center py-4">
                        <p>No tax compliance records found</p>
                    </div>
                )}
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

export default TaxComplianceGridLayer;
