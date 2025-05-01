import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TopPayingClients = () => {
    const [topClients, setTopClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopClients();
    }, []);

    const fetchTopClients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/myinvoices`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const invoices = response.data;
            
            // Calculate total payments by client
            const clientMap = {};
            
            invoices.forEach(invoice => {
                if (invoice.status === 'Paid') {
                    if (!clientMap[invoice.clientEmail]) {
                        clientMap[invoice.clientEmail] = {
                            name: invoice.clientName,
                            email: invoice.clientEmail,
                            phone: invoice.clientPhone,
                            totalPaid: 0,
                            invoiceCount: 0
                        };
                    }
                    clientMap[invoice.clientEmail].totalPaid += invoice.totalAmount || 0;
                    clientMap[invoice.clientEmail].invoiceCount += 1;
                }
            });

            // Convert to array and sort by total paid
            const clientsArray = Object.values(clientMap)
                .sort((a, b) => b.totalPaid - a.totalPaid)
                .slice(0, 6); // Get top 6 clients

            setTopClients(clientsArray);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Failed to load client data");
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="col-xxl-3 col-xl-12">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Top Paying Clients</h6>
                        <Link
                            to="/invoice-list"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-4">Loading client data...</div>
                    ) : topClients.length === 0 ? (
                        <div className="text-center py-4 text-muted">No paid invoices found</div>
                    ) : (
                        <div className="mt-32">
                            {topClients.map((client, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-between gap-3 mb-24">
                                    <div className="d-flex align-items-center">
                                        <div className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden bg-light-primary d-flex align-items-center justify-content-center">
                                            <Icon icon="mdi:user" className="text-primary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="text-md mb-0 fw-medium">{client.name}</h6>
                                            <span className="text-sm text-secondary-light fw-medium">
                                                {client.invoiceCount} {client.invoiceCount === 1 ? 'invoice' : 'invoices'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-primary-light text-md fw-medium">
                                        {formatCurrency(client.totalPaid)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopPayingClients;