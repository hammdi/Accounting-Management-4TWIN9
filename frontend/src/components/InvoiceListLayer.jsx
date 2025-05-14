"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"

const InvoiceListLayer = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalInvoices, setTotalInvoices] = useState(0)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)
  const [expandedInvoice, setExpandedInvoice] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)

  // Fetch invoices from API
  useEffect(() => {
    fetchInvoices()
  }, [statusFilter, currentPage, entriesPerPage])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/myinvoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Apply filters
      let filteredData = response.data

      if (statusFilter) {
        filteredData = filteredData.filter((invoice) => invoice.status === statusFilter)
      }

      setTotalInvoices(filteredData.length)

      // Apply pagination
      const startIndex = (currentPage - 1) * entriesPerPage
      const paginatedData = filteredData.slice(startIndex, startIndex + Number.parseInt(entriesPerPage))

      setInvoices(paginatedData)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setError("Failed to load invoices. Please try again later.")
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice._id?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value === "Select Status" ? "" : e.target.value)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle entries per page change
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(e.target.value)
    setCurrentPage(1) // Reset to first page when entries per page changes
  }

  // Handle pagination
  const totalPages = Math.ceil(totalInvoices / entriesPerPage)

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(invoices.map((invoice) => invoice._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectInvoice = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((invoiceId) => invoiceId !== id))
    } else {
      setSelectedInvoices([...selectedInvoices, id])
    }
  }

  // Handle view invoice
  const handleViewInvoice = (id) => {
    setExpandedInvoice(id === expandedInvoice ? null : id)
  }

  // Handle edit invoice
  const handleEditInvoice = (id) => {
    navigate(`/invoice-edit/${id}`)
  }

  // Show confirm dialog for delete
  const handleDeleteInvoice = (id) => {
    setInvoiceToDelete(id)
    setShowDeleteDialog(true)
  }

  // Actually perform delete after confirmation
  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/invoices/deleteinvoice/${invoiceToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setShowDeleteDialog(false)
      setInvoiceToDelete(null)
      toast.success("Invoice deleted successfully")
      fetchInvoices()
    } catch (err) {
      setShowDeleteDialog(false)
      setInvoiceToDelete(null)
      console.error("Error deleting invoice:", err)
      toast.error("Failed to delete invoice. Please try again.")
    }
  }

  const handleStatusChange = async (invoiceId, newStatus) => {
    const token = localStorage.getItem("token")

    try {
      // Get the current invoice data
      const currentInvoice = invoices.find((inv) => inv._id === invoiceId)
      if (!currentInvoice) return

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/invoices/updateinvoice/${invoiceId}`,
        {
          clientName: currentInvoice.clientName,
          clientEmail: currentInvoice.clientEmail,
          clientPhone: currentInvoice.clientPhone,
          dueDate: currentInvoice.dueDate,
          status: newStatus,
          items: currentInvoice.items || [],
          subtotal: currentInvoice.subtotal || 0,
          discount: currentInvoice.discount || 0,
          taxAmount: currentInvoice.taxAmount || 0,
          totalAmount: currentInvoice.totalAmount || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update the local state
      setInvoices(invoices.map((invoice) => (invoice._id === invoiceId ? { ...invoice, status: newStatus } : invoice)))
      setEditingStatus(null)
    } catch (err) {
      console.error("Error updating invoice status:", err)
      toast.error("Failed to update invoice status. Please try again.")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "success"
      case "Pending":
        return "warning"
      case "Overdue":
        return "danger"
      default:
        return "secondary"
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Twilio SMS sending function
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

  const sendMessage = async () => {
    try {
      const response = await fetch("https://backend2-fix5.onrender.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber, message }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(`✅ Message sent! SID: ${data.sid}`)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`)
    }
  }

  const handleSendMessage = async (invoice) => {
    const { clientPhone, clientName, invoiceNumber, totalAmount, dueDate } = invoice

    if (!clientPhone) {
      alert("Le numéro de téléphone du client est manquant !")
      return
    }

    // Ajouter +216 si le numéro ne commence pas déjà par +216
    const formattedPhone = clientPhone.startsWith("+216") ? clientPhone : `+216${clientPhone}`

    const message = `Bonjour ${clientName},\n\nVotre facture est disponible.\nMontant total : ${totalAmount} DT\nDate d'échéance : ${new Date(dueDate).toLocaleDateString()}\n\nMerci pour votre confiance.`

    try {
      const response = await fetch("https://backend2-fix5.onrender.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: formattedPhone, message }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Message envoyé avec succès ! SID : ${data.sid}`)
        console.log(`✅ SMS envoyé :`, {
          to: formattedPhone,
          message: message,
          sid: data.sid,
        })
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      alert(`❌ Erreur : ${err.message}`)
      console.error(`❌ Erreur lors de l'envoi du SMS :`, err.message)
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ConfirmDeleteDialog
        show={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setInvoiceToDelete(null)
        }}
        onConfirm={confirmDeleteInvoice}
        invoiceName={invoiceToDelete}
      />
      <div className="card">
        {/* ... (rest of the JSX remains the same) */}

        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span>Show</span>
              <select
                className="form-select form-select-sm w-auto"
                value={entriesPerPage}
                onChange={handleEntriesPerPageChange}
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
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="icon">
                <Icon icon="ion:search-outline" />
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3">
            <select
              className="form-select form-select-sm w-auto"
              value={statusFilter || "Select Status"}
              onChange={handleStatusFilterChange}
            >
              <option value="Select Status" disabled>
                Select Status
              </option>
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <Link to="/invoice-add" className="btn btn-sm btn-primary-600">
              <i className="ri-add-line" /> Create Invoice
            </Link>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
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
                    <th scope="col">Invoice</th>
                    <th scope="col">Name</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">creation Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <React.Fragment key={invoice._id}>
                        <tr>
                          <td>
                            <div className="form-check style-check d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`check${invoice._id}`}
                                checked={selectedInvoices.includes(invoice._id)}
                                onChange={() => handleSelectInvoice(invoice._id)}
                              />
                              <label className="form-check-label" htmlFor={`check${invoice._id}`}>
                                {String(filteredInvoices.indexOf(invoice) + 1).padStart(2, "0")}
                              </label>
                            </div>
                          </td>
                          <td>
                            <Link to={`/invoice-preview/${invoice._id}`} className="text-primary-600">
                              #TU{invoice._id.substring(0, 6)}
                            </Link>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={`https://ui-avatars.com/api/?name=${invoice.clientName}&background=random`}
                                alt=""
                                className="flex-shrink-0 me-12 radius-8"
                                width="40"
                                height="40"
                              />
                              <h6 className="text-md mb-0 fw-medium flex-grow-1">{invoice.clientName}</h6>
                            </div>
                          </td>
                          <td>{formatDate(invoice.dueDate)}</td>
                          <td>{formatDate(invoice.createdAt)}</td>
                          <td>{formatCurrency(invoice.totalAmount)}</td>
                          <td>
                            {editingStatus === invoice._id ? (
                              <select
                                className={`bg-${invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}-focus text-${invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}-main px-24 py-4 rounded-pill fw-medium text-sm`}
                                value={invoice.status}
                                onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                                onBlur={() => setEditingStatus(null)}
                                autoFocus
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                              </select>
                            ) : (
                              <span
                                className={`bg-${invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}-focus text-${invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}-main px-24 py-4 rounded-pill fw-medium text-sm cursor-pointer`}
                                onClick={() => setEditingStatus(invoice._id)}
                              >
                                {invoice.status}
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() => handleViewInvoice(invoice._id)}
                              className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                            >
                              <Icon icon="iconamoon:eye-light" />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(invoice._id)}
                              className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            >
                              <Icon icon="lucide:edit" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice._id)}
                              className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            >
                              <Icon icon="mingcute:delete-2-line" />
                            </button>
                          </td>
                        </tr>
                        {expandedInvoice === invoice._id && (
                          <tr>
                            <td colSpan="9" className="p-4">
                              <div className="card border-0">
                                <div className="card-body">
                                  <h5 className="card-title">Invoice Details</h5>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p>
                                        <strong>Client Name:</strong> {invoice.clientName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {invoice.clientEmail}
                                      </p>
                                      <p>
                                        <strong>Phone:</strong> {invoice.clientPhone}
                                      </p>
                                      <p>
                                        <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
                                      </p>
                                    </div>
                                    <div className="col-md-6">
                                      <p>
                                        <strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}
                                      </p>
                                      <p>
                                        <strong>Discount:</strong> {formatCurrency(invoice.discount)}
                                      </p>
                                      <p>
                                        <strong>Tax:</strong> {formatCurrency(invoice.taxAmount)}
                                      </p>
                                      <p>
                                        <strong>Total:</strong> {formatCurrency(invoice.totalAmount)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <h6>Items:</h6>
                                    <ul className="list-group">
                                      {invoice.items?.map((item, index) => (
                                        <li key={index} className="list-group-item">
                                          {item.name} - {formatCurrency(item.price)} x {item.quantity}
                                        </li>
                                      ))}

                                      <button className="btn btn-primary" onClick={() => handleSendMessage(invoice)}>
                                        Send Message
                                      </button>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
                <span>
                  Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                  {Math.min(currentPage * entriesPerPage, totalInvoices)} of {totalInvoices} entries
                </span>
                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                  <li className="page-item">
                    <button
                      className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" className="text-xl" />
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map((page) => (
                    <li className="page-item" key={page + 1}>
                      <button
                        className={`page-link ${currentPage === page + 1 ? "bg-primary-600 text-white" : "bg-primary-50 text-secondary-light"} fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px`}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="ep:d-arrow-right" className="text-xl" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default InvoiceListLayer
