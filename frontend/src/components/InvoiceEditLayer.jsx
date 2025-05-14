"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"

const InvoiceEditLayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // State variables
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Invoice data state
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [issuedBy, setIssuedBy] = useState("")
  const [items, setItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [status, setStatus] = useState("Pending")

  // Editable fields state
  const [editableFields, setEditableFields] = useState({
    issueDate: false,
    dueDate: false,
    clientName: false,
    clientEmail: false,
    clientPhone: false,
  })

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/getinvoice/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const invoice = response.data

        // Set invoice data
        setInvoiceNumber(`TU${invoice._id.substring(0, 6)}`)
        setIssueDate(format(new Date(invoice.createdAt), "dd/MM/yyyy"))
        setDueDate(format(new Date(invoice.dueDate), "dd/MM/yyyy"))
        setClientName(invoice.clientName)
        setClientPhone(invoice.clientPhone)
        setClientEmail(invoice.clientEmail)
        setIssuedBy(invoice.issuedBy?.name || "Jammal") // Assuming issuedBy has a name property
        setItems(
          invoice.items.map((item, index) => ({
            id: index + 1,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            total: item.total,
          })),
        )
        setSubtotal(invoice.subtotal)
        setDiscount(invoice.discount)
        setTaxAmount(invoice.taxAmount)
        setTotalAmount(invoice.totalAmount)
        setStatus(invoice.status)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching invoice:", err)
        setError("Failed to load invoice. Please try again later.")
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [id])

  // Calculate totals when items or discount change
  useEffect(() => {
    let newSubtotal = 0
    let newTaxAmount = 0

    items.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity
      const itemTax = (itemTotal * item.taxRate) / 100
      newSubtotal += itemTotal
      newTaxAmount += itemTax
    })

    setSubtotal(newSubtotal)
    setTaxAmount(newTaxAmount)
    setTotalAmount(newSubtotal + newTaxAmount - discount)
  }, [items, discount])

  // Toggle edit mode for editable fields
  const toggleEditMode = (field) => {
    setEditableFields({
      ...editableFields,
      [field]: !editableFields[field],
    })
  }

  // Handle Adding New Row
  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        name: "",
        quantity: 1,
        unit: "PC",
        unitPrice: 0,
        taxRate: 19,
        total: 0,
      },
    ])
  }

  // Handle Removing Row
  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  // Handle Updating an Item Field
  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError("")

      // Format dates for backend
      const formattedDueDate = new Date(dueDate.split("/").reverse().join("-"))

      // Prepare data for API
      const invoiceData = {
        clientName,
        clientEmail,
        clientPhone,
        dueDate: formattedDueDate,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          total: item.total,
        })),
        subtotal,
        discount,
        taxAmount,
        totalAmount,
        status,
      }

      // Send to API
      const token = localStorage.getItem("token")
      await axios.put(`${process.env.REACT_APP_API_URL}/api/invoices/updateinvoice/${id}`, invoiceData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        navigate(`/invoice-preview/${id}`)
      }, 2000)
    } catch (err) {
      console.error("Error updating invoice:", err)
      setError(err.response?.data?.message || "Failed to update invoice")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading invoice data...</p>
        </div>
      </div>
    )
  }

  if (error && !items.length) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/invoice-list")}>
            Back to Invoice List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
            onClick={handleSubmit}
            disabled={saving}
          >
            <Icon icon="simple-line-icons:check" className="text-xl" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {success && <div className="alert alert-success mt-2">Invoice updated successfully!</div>}
      </div>
      <div className="card-body py-40">
        <div className="row justify-content-center" id="invoice">
          <div className="col-lg-8">
            <div className="shadow-4 border radius-8">
              <div className="p-20 border-bottom">
                <div className="row justify-content-between g-3">
                  <div className="col-sm-4">
                    <h3 className="text-xl">Invoice #{invoiceNumber}</h3>
                    <p className="mb-1 text-sm">
                      Date Issued:{" "}
                      {editableFields.issueDate ? (
                        <input
                          type="text"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          onBlur={() => toggleEditMode("issueDate")}
                          className="form-control form-control-sm"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            className="editable text-decoration-underline"
                            onClick={() => toggleEditMode("issueDate")}
                          >
                            {issueDate}
                          </span>{" "}
                          <span className="text-success-main" onClick={() => toggleEditMode("issueDate")}>
                            <Icon icon="mage:edit" />
                          </span>
                        </>
                      )}
                    </p>
                    <p className="mb-0 text-sm">
                      Date Due:{" "}
                      {editableFields.dueDate ? (
                        <input
                          type="text"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          onBlur={() => toggleEditMode("dueDate")}
                          className="form-control form-control-sm"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            className="editable text-decoration-underline"
                            onClick={() => toggleEditMode("dueDate")}
                          >
                            {dueDate}
                          </span>{" "}
                          <span className="text-success-main" onClick={() => toggleEditMode("dueDate")}>
                            <Icon icon="mage:edit" />
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="col-sm-4">
                    <img src="../../public/assets/images/logo.png" alt="image_icon" className="mb-8" />
                    <p className="mb-1 text-sm">4517 Washington Ave. Manchester, Kentucky 39495</p>
                    <p className="mb-0 text-sm">
                      {clientEmail}, {clientPhone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-28 px-20">
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                  <div>
                    <h6 className="text-md">Issus For:</h6>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr>
                          <td>Name</td>
                          <td className="ps-8">
                            :{" "}
                            {editableFields.clientName ? (
                              <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                onBlur={() => toggleEditMode("clientName")}
                                className="form-control form-control-sm"
                                autoFocus
                              />
                            ) : (
                              <>
                                <span
                                  className="editable text-decoration-underline"
                                  onClick={() => toggleEditMode("clientName")}
                                >
                                  {clientName}
                                </span>
                                <span className="text-success-main" onClick={() => toggleEditMode("clientName")}>
                                  <Icon icon="mage:edit" />
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Address</td>
                          <td className="ps-8">
                            :{" "}
                            {editableFields.clientEmail ? (
                              <input
                                type="text"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                onBlur={() => toggleEditMode("clientEmail")}
                                className="form-control form-control-sm"
                                autoFocus
                              />
                            ) : (
                              <>
                                <span
                                  className="editable text-decoration-underline"
                                  onClick={() => toggleEditMode("clientEmail")}
                                >
                                  {clientEmail}
                                </span>{" "}
                                <span className="text-success-main" onClick={() => toggleEditMode("clientAddress")}>
                                  <Icon icon="mage:edit" />
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Phone</td>
                          <td className="ps-8">
                            :{" "}
                            {editableFields.clientPhone ? (
                              <input
                                type="text"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                onBlur={() => toggleEditMode("clientPhone")}
                                className="form-control form-control-sm"
                                autoFocus
                              />
                            ) : (
                              <>
                                <span
                                  className="editable text-decoration-underline"
                                  onClick={() => toggleEditMode("clientPhone")}
                                >
                                  {clientPhone}
                                </span>{" "}
                                <span className="text-success-main" onClick={() => toggleEditMode("clientPhone")}>
                                  <Icon icon="mage:edit" />
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-end">
                    <h6 className="text-md">Issued By:</h6>
                    <h4 className="text-xl">{issuedBy}</h4>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-borderless align-middle">
                  <thead>
                    <tr className="text-uppercase text-secondary-light">
                      <th scope="col">#</th>
                      <th scope="col">Item</th>
                      <th scope="col">Unit</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Unit Price</th>
                      <th scope="col">Tax(%)</th>
                      <th scope="col">Total</th>
                      <th scope="col" className="text-end">
                        <button className="btn btn-primary btn-sm" onClick={addNewItem}>
                          <Icon icon="ic:round-plus" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row" className="text-muted">
                          {item.id}
                        </th>
                        <td>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value))}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value))}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.taxRate}
                            onChange={(e) => updateItem(item.id, "taxRate", Number.parseFloat(e.target.value))}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td className="text-muted">${(item.total ?? 0).toFixed(2)}</td>
                        <td className="text-end">
                          <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>
                            <Icon icon="ic:round-minus" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-20">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <table className="table table-borderless text-secondary-light">
                      <tbody>
                        <tr>
                          <th scope="row">Sub Total:</th>
                          <td>${(subtotal ?? 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th scope="row">Discount:</th>
                          <td>
                            <input
                              type="number"
                              value={discount}
                              onChange={(e) => setDiscount(Number.parseFloat(e.target.value))}
                              className="form-control form-control-sm"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Tax Amount:</th>
                          <td>${(taxAmount ?? 0).toFixed(2)}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="text-info">
                          <th scope="row">Total:</th>
                          <td>${(totalAmount ?? 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceEditLayer
