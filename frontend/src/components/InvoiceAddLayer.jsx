"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { useState, useEffect } from "react"
import axios from "axios"
import { format } from "date-fns"
import {getCurrentUser} from "../services/authService";

const InvoiceAddLayer = () => {
    // Form state
    const [invoiceNumber, setInvoiceNumber] = useState("3492")
    const [issueDate, setIssueDate] = useState(format(new Date(), "dd/MM/yyyy"))
    const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "dd/MM/yyyy"))
    const [clientName, setClientName] = useState("Will Marthas")
    const [clientAddress, setClientAddress] = useState("4517 Washington Ave.USA")
    const [clientPhone, setClientPhone] = useState("+1 543 2198")
    const [clientEmail, setClientEmail] = useState("random@gmail.com")
    const [issuedBy, setIssuedBy] = useState("Jammal")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    // Items state
    const [items, setItems] = useState([
        { id: 1, name: "Apple's Shoes", quantity: 5, unit: "PC", unitPrice: 200, taxRate: 19, total: 1000 },
    ])

    // Calculation state
    const [subtotal, setSubtotal] = useState(1000)
    const [taxAmount, setTaxAmount] = useState(190)
    const [totalAmount, setTotalAmount] = useState(1190)
    const [discount, setDiscount] = useState(0)
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getCurrentUser();
            console.log(userData)
            if (userData) {
                setUser(userData);

            }
        };
        fetchUser().then(r => console.log(""));
    }, []);
    // Calculate Subtotal, Tax, and Total
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

    // Handle Adding New Row
    const addNewItem = () => {
        const newItem = {
            id: items.length + 1,
            name: "",
            quantity: 1,
            unit: "PC",
            unitPrice: 0,
            taxRate: 19,
            total: 0,
        }
        setItems([...items, newItem])
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
            setLoading(true)
            setError("")

            // Format dates for backend
            const formattedIssueDate = new Date(issueDate.split("/").reverse().join("-"))
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
                // These would typically come from your auth system
                company: "64f5f7f0e5d1d3a3e4b3c2d1", // Example ID - replace with actual company ID
                issuedBy: user._id, // Example ID - replace with actual user ID
                status: "Pending",
            }

            // Send to API
            const response = await axios.post("http://localhost:5000/api/invoices/addinvoice", invoiceData)

            if (response.data) {
                setSuccess(true)
                // Optionally reset form or redirect
                setTimeout(() => {
                    setSuccess(false)
                }, 3000)
            }
        } catch (err) {
            console.error("Error creating invoice:", err)
            setError(err.response?.data?.message || "Failed to create invoice")
        } finally {
            setLoading(false)
        }
    }

    // Toggle edit mode for editable fields
    const [editableFields, setEditableFields] = useState({
        issueDate: false,
        dueDate: false,
        clientName: false,
        clientAddress: false,
        clientPhone: false,
    })

    const toggleEditMode = (field) => {
        setEditableFields({
            ...editableFields,
            [field]: !editableFields[field],
        })
    }

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        <Icon icon="simple-line-icons:check" className="text-xl" />
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {success && <div className="alert alert-success mt-2">Invoice created successfully!</div>}
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
                                        <img src="assets/images/logo.png" alt="image_icon" className="mb-8" />
                                        <p className="mb-1 text-sm">4517 Washington Ave. Manchester, Kentucky 39495</p>
                                        <p className="mb-0 text-sm">
                                            {user ? user.email : ""}, +216 {user ? user.phone : ""}
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
                                                    {editableFields.clientAddress ? (
                                                        <input
                                                            type="text"
                                                            value={clientAddress}
                                                            onChange={(e) => setClientAddress(e.target.value)}
                                                            onBlur={() => toggleEditMode("clientAddress")}
                                                            className="form-control form-control-sm"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <>
                                <span
                                    className="editable text-decoration-underline"
                                    onClick={() => toggleEditMode("clientAddress")}
                                >
                                  {clientAddress}
                                </span>{" "}
                                                            <span className="text-success-main" onClick={() => toggleEditMode("clientAddress")}>
                                  <Icon icon="mage:edit" />
                                </span>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Phone number</td>
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
                                    <div>
                                        <table className="text-sm text-secondary-light">
                                            <tbody>
                                            <tr>
                                                <td>Issus Date</td>
                                                <td className="ps-8">:{format(new Date(), "dd MMM yyyy")}</td>
                                            </tr>
                                            <tr>
                                                <td>Order ID</td>
                                                <td className="ps-8">:#653214</td>
                                            </tr>
                                            <tr>
                                                <td>Shipment ID</td>
                                                <td className="ps-8">:#965215</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-24">
                                    <div className="table-responsive scroll-sm">
                                        <table className="table bordered-table text-sm" id="invoice-table">
                                            <thead>
                                            <tr>
                                                <th scope="col" className="text-sm">
                                                    SL.
                                                </th>
                                                <th scope="col" className="text-sm">
                                                    Items
                                                </th>
                                                <th scope="col" className="text-sm">
                                                    Qty
                                                </th>
                                                <th scope="col" className="text-sm">
                                                    Units
                                                </th>
                                                <th scope="col" className="text-sm">
                                                    Unit Price
                                                </th>
                                                <th scope="col" className="text-sm">
                                                    Tax Rate (%)
                                                </th>
                                                <th scope="col" className="text-sm">
                                                    Price
                                                </th>
                                                <th scope="col" className="text-center text-sm">
                                                    Action
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {items.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{String(index + 1).padStart(2, "0")}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={item.name}
                                                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={item.unit}
                                                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={item.unitPrice}
                                                            onChange={(e) =>
                                                                updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)
                                                            }
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={item.taxRate}
                                                            onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value))}
                                                        >
                                                            <option value="0">0%</option>
                                                            <option value="7">7%</option>
                                                            <option value="13">13%</option>
                                                            <option value="19">19%</option>
                                                        </select>
                                                    </td>
                                                    <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                                    <td className="text-center">
                                                        <button type="button" className="remove-row"
                                                                onClick={() => removeItem(item.id)}>
                                                            <Icon icon="ic:twotone-close"
                                                                  className="text-danger-main text-xl"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            id="addRow"
                                            className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                                            onClick={addNewItem}
                                        >
                                            <Icon icon="simple-line-icons:plus" className="text-xl"/>
                                            Add New
                                        </button>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-between gap-3 mt-24">
                                        <div>
                                            <p className="text-sm mb-0">
                                                <span className="text-primary-light fw-semibold">Sales By:</span> {user ? user.name : ""}
                                            </p>
                                            <p className="text-sm mb-0">Thanks for your business</p>
                                        </div>
                                        <div>
                                            <table className="text-sm">
                                                <tbody>
                                                <tr>
                                                    <td className="pe-64">Subtotal:</td>
                                                    <td className="pe-16">
                                                        <span className="text-primary-light fw-semibold">${subtotal.toFixed(2)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pe-64">Discount:</td>
                                                    <td className="pe-16">
                              <span className="text-primary-light fw-semibold">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                                    min="0"
                                />
                              </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pe-64 border-bottom pb-4">Tax:</td>
                                                    <td className="pe-16 border-bottom pb-4">
                                                        <span className="text-primary-light fw-semibold">${taxAmount.toFixed(2)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pe-64 pt-4">
                                                        <span className="text-primary-light fw-semibold">Total:</span>
                                                    </td>
                                                    <td className="pe-16 pt-4">
                                                        <span className="text-primary-light fw-semibold">${totalAmount.toFixed(2)}</span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-64">
                                    <p className="text-center text-secondary-light text-sm fw-semibold">Thank you for your purchase!</p>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between align-items-end mt-64">
                                    <div className="text-sm border-top d-inline-block px-12">Signature of Customer</div>
                                    <div className="text-sm border-top d-inline-block px-12">Signature of Authorized</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceAddLayer

