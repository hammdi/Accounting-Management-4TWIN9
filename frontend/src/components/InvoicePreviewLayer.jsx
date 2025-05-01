import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
//import companyLogo from '../assets/images/logo.png'; // Update this path to match your project structure

const InvoicePreviewLayer = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [smsSent, setSMSSent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [smsError, setSMSError] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/getinvoice/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }

                );
                setInvoice(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching invoice:", err);
                setError("Failed to load invoice details");
                setLoading(false);
            }
        };

        if (id) {
            fetchInvoice();
        }
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const invoiceElement = document.getElementById('invoice');

        html2canvas(invoiceElement).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`invoice-${invoice?._id || 'download'}.pdf`);
        });
    };

    const handleSendEmail = async () => {
        if (!invoice || !invoice.clientEmail) {
            alert("Client email is missing!");
            return;
        }

        try {
            setSending(true);

            // Generate PDF and convert to base64
            const invoiceElement = document.getElementById('invoice');
            const canvas = await html2canvas(invoiceElement);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            const pdfBase64 = pdf.output('datauristring');

            // Send email with PDF attachment
            await axios.post(`${process.env.REACT_APP_API_URL}/api/invoices/sendemail`, {
                invoiceId: invoice._id,
                email: invoice.clientEmail,
                subject: `Invoice #${invoice.invoiceNumber || '3492'}`,
                message: `Dear ${invoice.clientName},\n\nPlease find attached your invoice #${invoice.invoiceNumber || '3492'}.\n\nThank you for your business.\n\nRegards,\nYour Company`,
                pdfAttachment: pdfBase64
            });

            setEmailSent(true);
            setSending(false);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setEmailSent(false);
            }, 3000);

        } catch (err) {
            console.error("Error sending email:", err);
            alert("Failed to send email. Please try again.");
            setSending(false);
        }
    };

    const handleSendSMS = async () => {
        if (!invoice || !phoneNumber) {
            alert("Please enter a phone number!");
            return;
        }

        try {
            setSending(true);
            setSMSError('');

            // Format phone number to Tunisian format if needed
            let formattedNumber = phoneNumber;
            if (!phoneNumber.startsWith('+216')) {
                formattedNumber = '+216' + phoneNumber.replace(/^0/, '');
            }

            // Send SMS with invoice details
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/sms/send`, {
                invoiceId: invoice._id,
                phoneNumber: formattedNumber
            });

            if (response.data.success) {
                setSMSSent(true);
                setSMSError('');
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setSMSSent(false);
                }, 3000);
            } else {
                setSMSError(response.data.error || 'Failed to send SMS');
            }

        } catch (error) {
            console.error("Error sending SMS:", error);
            setSMSError(error.response?.data?.error || "Failed to send SMS. Please check the phone number and try again.");
        } finally {
            setSending(false);
        }
    };

    const handleEdit = () => {
        if (id) {
            navigate(`/invoice-edit/${id}`);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body py-40 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading invoice details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="card-body py-40 text-center">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/invoice-list')}
                    >
                        Back to Invoices
                    </button>
                </div>
            </div>
        );
    }

    // Use default values if invoice data is not available
    const invoiceData = invoice || {
        invoiceNumber: '3492',
        issueDate: '25/08/2020',
        dueDate: '29/08/2020',
        clientName: 'Will Marthas',
        clientAddress: '4517 Washington Ave.USA',
        clientPhone: '+1 543 2198',
        clientEmail: 'random@gmail.com',
        items: [
            { name: "Apple's Shoes", quantity: 5, unit: "PC", unitPrice: 200, total: 1000 },
            { name: "Apple's Shoes", quantity: 5, unit: "PC", unitPrice: 200, total: 1000 },
            { name: "Apple's Shoes", quantity: 5, unit: "PC", unitPrice: 200, total: 1000 },
            { name: "Apple's Shoes", quantity: 5, unit: "PC", unitPrice: 200, total: 1000 }
        ],
        subtotal: 4000,
        discount: 0,
        taxAmount: 0,
        totalAmount: 1690,
        issuedBy: 'Jammal'
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                    {emailSent && (
                        <div className="alert alert-success mb-0">
                            Email sent successfully to {invoiceData.clientEmail}!
                        </div>
                    )}
                    {smsSent && (
                        <div className="alert alert-success mb-0">
                            SMS sent successfully to {phoneNumber}!
                        </div>
                    )}
                    {smsError && (
                        <div className="alert alert-danger mb-0">
                            {smsError}
                        </div>
                    )}
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 ms-auto">
                        <button
                            onClick={handleSendEmail}
                            disabled={sending}
                            className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                        >
                            <Icon icon="pepicons-pencil:paper-plane" className="text-xl" />
                            {sending ? 'Sending...' : 'Send Invoice'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="btn btn-sm btn-warning radius-8 d-inline-flex align-items-center gap-1"
                        >
                            <Icon icon="solar:download-linear" className="text-xl" />
                            Download
                        </button>
                        <button
                            onClick={handleEdit}
                            className="btn btn-sm btn-success radius-8 d-inline-flex align-items-center gap-1"
                        >
                            <Icon icon="uil:edit" className="text-xl" />
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="btn btn-sm btn-danger radius-8 d-inline-flex align-items-center gap-1"
                        >
                            <Icon icon="basil:printer-outline" className="text-xl" />
                            Print
                        </button>
                        <div className="sms-input-container">
                            <input
                                type="tel"
                                placeholder="Numéro de téléphone (ex: +21652903314)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="sms-input"
                            />
                            <button onClick={handleSendSMS} className="btn btn-sm btn-info radius-8 d-inline-flex align-items-center gap-1" disabled={sending}>
                                {sending ? (
                                    <>
                                        <Icon icon="mdi:loading" className="animate-spin" /> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="mdi:message-text" /> Send SMS
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body py-40">
                <div className="row justify-content-center" id="invoice">
                    <div className="col-lg-8">
                        <div className="shadow-4 border radius-8">
                            <div className="p-20 d-flex flex-wrap justify-content-between gap-3 border-bottom">
                                <div>
                                    <h3 className="text-xl">Invoice #{invoiceData.invoiceNumber}</h3>
                                    <p className="mb-1 text-sm">Date Issued: {invoiceData.issueDate}</p>
                                    <p className="mb-0 text-sm">Date Due: {invoiceData.dueDate}</p>
                                </div>
                                <div>
                                    {/* Use imported logo or fallback to a data URI if needed */}
                                    <img
                                        src="/assets/images/logo.png" alt='company logo'
                                    />
                                    <p className="mb-1 text-sm">
                                        4517 Washington Ave. Manchester, Kentucky 39495
                                    </p>
                                    <p className="mb-0 text-sm">{invoiceData.clientEmail}, {invoiceData.clientPhone}</p>
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
                                                <td className="ps-8">:{invoiceData.clientName}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td className="ps-8">:{invoiceData.clientEmail}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone number</td>
                                                <td className="ps-8">:{invoiceData.clientPhone}</td>
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
                                        <table className="table bordered-table text-sm">
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
                                                <th scope="col" className="text-end text-sm">
                                                    Price
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {invoiceData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{String(index + 1).padStart(2, '0')}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.unit}</td>
                                                    <td>${item.unitPrice}</td>
                                                    <td className="text-end">${item.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-between gap-3">
                                        <div>
                                            <p className="text-sm mb-0">
                                                <span className="text-primary-light fw-semibold">
                                                    Sales By:
                                                </span>{" "}
                                                {invoiceData.issuedBy?.name ?? invoiceData.issuedBy}
                                            </p>
                                            <p className="text-sm mb-0">Thanks for your business</p>
                                        </div>
                                        <div>
                                            <table className="text-sm">
                                                <tbody>
                                                <tr>
                                                    <td className="pe-64">Subtotal:</td>
                                                    <td className="pe-16">
                                                            <span className="text-primary-light fw-semibold">
                                                                ${invoiceData.subtotal.toFixed(2)}
                                                            </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pe-64">Discount:</td>
                                                    <td className="pe-16">
                                                            <span className="text-primary-light fw-semibold">
                                                                ${invoiceData.discount.toFixed(2)}
                                                            </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pe-64 border-bottom pb-4">Tax:</td>
                                                    <td className="pe-16 border-bottom pb-4">
                                                            <span className="text-primary-light fw-semibold">
                                                                ${invoiceData.taxAmount.toFixed(2)}
                                                            </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pe-64 pt-4">
                                                            <span className="text-primary-light fw-semibold">
                                                                Total:
                                                            </span>
                                                    </td>
                                                    <td className="pe-16 pt-4">
                                                            <span className="text-primary-light fw-semibold">
                                                                ${invoiceData.totalAmount.toFixed(2)}
                                                            </span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-64">
                                    <p className="text-center text-secondary-light text-sm fw-semibold">
                                        Thank you for your purchase!
                                    </p>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between align-items-end mt-64">
                                    <div className="text-sm border-top d-inline-block px-12">
                                        Signature of Customer
                                    </div>
                                    <div className="text-sm border-top d-inline-block px-12">
                                        Signature of Authorized
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default InvoicePreviewLayer;
