import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from 'react-router-dom';

const CompanyListLayer = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState('name');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCompany, setModalCompany] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');


  // Delete confirmation dialog state
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/mycompanies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompanies(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  // Delete company (show popup)
  const handleDelete = (companyId) => {
    setCompanyToDelete(companyId);
    setShowDeleteDialog(true);
  };

  // Confirm delete (after popup)
  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/companies/deletecompany/${companyToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Company deleted successfully');
      fetchCompanies(); // Refresh list
    } catch (err) {
      toast.error('Failed to delete company');
    } finally {
      setShowDeleteDialog(false);
      setCompanyToDelete(null);
    }
  };


  useEffect(() => {
    fetchCompanies();
  }, []);

  const sortCompanies = (companies, sortBy, sortOrder) => {
    return [...companies].sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'name':
          compareA = a.name?.toLowerCase() || '';
          compareB = b.name?.toLowerCase() || '';
          break;
        case 'taxNumber':
          compareA = a.taxNumber?.toLowerCase() || '';
          compareB = b.taxNumber?.toLowerCase() || '';
          break;
        case 'status':
          compareA = a.status?.toLowerCase() || '';
          compareB = b.status?.toLowerCase() || '';
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });
  };

  const filteredCompanies = companies.filter((company) =>
    (company.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (company.taxNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const sortedCompanies = sortCompanies(filteredCompanies, sortBy, sortOrder);
  const pageCount = Math.ceil(sortedCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCompanies = sortedCompanies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCompanies(new Set());
    } else {
      const companyIds = displayedCompanies.map(company => company._id);
      setSelectedCompanies(new Set(companyIds));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCompany = (companyId) => {
    if (selectedCompanies.has(companyId)) {
      selectedCompanies.delete(companyId);
    } else {
      selectedCompanies.add(companyId);
    }
    setSelectedCompanies(new Set(selectedCompanies));
  };

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
      <div className="alert alert-danger">{error}</div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span>Show</span>
            <select
              className="form-select form-select-sm w-auto"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="icon-field">
            <input
              type="text"
              name="search"
              className="form-control form-control-sm w-auto"
              placeholder="Search by name or tax number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">
              <Icon icon="ion:search-outline" />
            </span>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <select
            className="form-select form-select-sm w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="taxNumber">Tax Number</option>
            <option value="status">Status</option>
          </select>
          <select
            className="form-select form-select-sm w-auto"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
   <Link to="/company" className="btn btn-sm btn-primary-600">
                        <i className="ri-add-line" /> Create company
                    </Link>
        </div>
      </div>
      <div className="card-body">
        {displayedCompanies.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No companies found
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col">
                    <div className="form-check style-check d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkAll"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      <label className="form-check-label" htmlFor="checkAll">
                        S.L
                      </label>
                    </div>
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Tax Number</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedCompanies.map((company) => (
                  <tr key={company._id}>
                    <td>
                      <div className="form-check style-check d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`check${company._id}`}
                          checked={selectedCompanies.has(company._id)}
                          onChange={() => handleSelectCompany(company._id)}
                        />
                        <label className="form-check-label" htmlFor={`check${company._id}`}>
                          {displayedCompanies.indexOf(company) + 1}
                        </label>
                      </div>
                    </td>
                    <td>{company.name}</td>
                    <td>{company.taxNumber}</td>
                    <td>{company.address}</td>
                    <td>{company.phone}</td>
                    <td>
                      <span 
                        className={`bg-${company.status.toLowerCase()}-focus text-${company.status.toLowerCase()}-main px-24 py-4 rounded-pill fw-medium text-sm cursor-pointer`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                            onClick={() => {
                              setModalCompany(company);
                              setModalMode('view');
                              setModalOpen(true);
                            }}
                          >
                            <Icon icon="iconamoon:eye-light" />
                          </button>
                          <button
                            type="button"
                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            onClick={() => {
                              setModalCompany(company);
                              setModalMode('edit');
                              setModalOpen(true);
                            }}
                          >
                            <Icon icon="lucide:edit" />
                          </button>
                          <button
                            onClick={() => handleDelete(company._id)}
                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                          >
                            <Icon icon="mingcute:delete-2-line" />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pageCount > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    {/* Modal for view/edit company */}
    {modalOpen && modalCompany && (
      <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalMode === 'edit' ? 'Edit Company' : 'Company Details'}
              </h5>
              <button type="button" className="btn-close" onClick={() => { setModalOpen(false); setModalError(''); }}></button>
            </div>
            <div className="modal-body">
              {modalError && <div className="alert alert-danger">{modalError}</div>}
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  {modalMode === 'edit' ? (
                    <input
                      className="form-control"
                      name="name"
                      value={modalCompany.name}
                      onChange={e => setModalCompany(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div>{modalCompany.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Tax Number</label>
                  {modalMode === 'edit' ? (
                    <input
                      className="form-control"
                      name="taxNumber"
                      value={modalCompany.taxNumber}
                      onChange={e => setModalCompany(prev => ({ ...prev, taxNumber: e.target.value }))}
                    />
                  ) : (
                    <div>{modalCompany.taxNumber}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  {modalMode === 'edit' ? (
                    <input
                      className="form-control"
                      name="address"
                      value={modalCompany.address}
                      onChange={e => setModalCompany(prev => ({ ...prev, address: e.target.value }))}
                    />
                  ) : (
                    <div>{modalCompany.address}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  {modalMode === 'edit' ? (
                    <input
                      className="form-control"
                      name="phone"
                      value={modalCompany.phone}
                      onChange={e => setModalCompany(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div>{modalCompany.phone}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  {modalMode === 'edit' ? (
                    <select
                      className="form-select"
                      name="status"
                      value={modalCompany.status}
                      onChange={e => setModalCompany(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <div>{modalCompany.status}</div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {modalMode === 'edit' ? (
                <>
                  <button type="button" className="btn btn-success" onClick={async () => {
                    setModalLoading(true);
                    setModalError('');
                    try {
                      const token = localStorage.getItem('token');
                      const response = await axios.put(
                        `${process.env.REACT_APP_API_URL}/api/companies/updatecompany/${modalCompany._id}`,
                        modalCompany,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        }
                      );
                      // Accept either { success: true } or direct company object as a valid update
                      if ((response.data && response.data.success) || (response.status === 200 && response.data)) {
                        toast.success('Company updated successfully');
                        setModalOpen(false);
                        // Optimistically update the local list to avoid confusion
                        setCompanies(prev => prev.map(c => c._id === modalCompany._id ? { ...c, ...modalCompany } : c));
                        fetchCompanies();
                      } else {
                        setModalError(response.data.message || 'Failed to update company');
                      }
                    } catch (err) {
                      setModalError(err.response?.data?.message || 'Failed to update company');
                    } finally {
                      setModalLoading(false);
                    }
                  }} disabled={modalLoading}>
                    {modalLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={modalLoading}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => setModalMode('edit')}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    <ToastContainer position="top-right" autoClose={3000} />
    <ConfirmDeleteDialog
      show={showDeleteDialog}
      onClose={() => { setShowDeleteDialog(false); setCompanyToDelete(null); }}
      onConfirm={confirmDeleteCompany}
      invoiceName={(() => {
        const company = companies.find(c => c._id === companyToDelete);
        return company ? company.name : '';
      })()}
    />
  </div>
  );
};

export default CompanyListLayer;
