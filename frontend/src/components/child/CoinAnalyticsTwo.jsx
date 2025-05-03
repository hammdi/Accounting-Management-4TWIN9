import React, { useEffect, useState } from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import axios from "axios";
import { Icon } from '@iconify/react';

const TaxAnalytics = () => {
    const { createChartFour } = useReactApexChart();
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState('All Years');

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

    // Get unique years for filter dropdown
    const uniqueYears = ['All Years', ...new Set(taxes.map(tax => tax.taxYear))].sort((a, b) => {
        if (a === 'All Years') return -1;
        if (b === 'All Years') return 1;
        return b - a;
    });

    // Filter taxes by selected year
    const filteredTaxes = selectedYear === 'All Years' 
        ? taxes 
        : taxes.filter(tax => tax.taxYear === parseInt(selectedYear));

    // Group taxes by company and calculate totals
    const companyTaxData = filteredTaxes.reduce((acc, tax) => {
        const companyName = tax.company?.name || 'Unknown Company';
        if (!acc[companyName]) {
            acc[companyName] = {
                totalAmount: 0,
                pendingCount: 0,
                filedCount: 0,
                status: 'Pending' // Default status
            };
        }
        
        acc[companyName].totalAmount += tax.taxAmount || 0;
        if (tax.status === 'Filed') {
            acc[companyName].filedCount += 1;
            acc[companyName].status = 'Filed'; // If any tax is filed, mark as filed
        } else {
            acc[companyName].pendingCount += 1;
        }
        
        return acc;
    }, {});

    // Convert to array and sort by total amount (descending)
    const sortedCompanyTaxes = Object.entries(companyTaxData)
        .map(([company, data]) => ({
            company,
            ...data
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount);

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="col-xxl-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg">Tax Compliance Analytics</h6>
                        <div className="border radius-4 px-3 py-2 pe-0 d-flex align-items-center gap-1 text-sm text-secondary-light">
                            Filter by Year:
                            <select 
                                className="form-select form-select-sm w-auto bg-base border-0 text-primary-light fw-semibold text-sm" 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {sortedCompanyTaxes.length === 0 ? (
                        <div className="text-center py-4">
                            <p>No tax compliance records found</p>
                        </div>
                    ) : (
                        sortedCompanyTaxes.map((companyTax, index) => {
                            // Determine chart color based on status
                            const chartColor = companyTax.status === 'Filed' ? '#45B369' : '#EF4A00';
                            // Calculate percentage of filed taxes
                            const filedPercentage = companyTax.filedCount / (companyTax.filedCount + companyTax.pendingCount) * 100;
                            
                            return (
                                <div 
                                    key={index} 
                                    className="d-flex flex-wrap align-items-center justify-content-between gap-2 bg-neutral-200 px-8 py-8 radius-4 mb-16"
                                >
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="w-36-px h-36-px rounded-circle flex-shrink-0 bg-primary-100 d-flex align-items-center justify-content-center">
                                            <Icon icon="ph:buildings" className="text-primary-600 text-xl" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="text-md mb-0">{companyTax.company}</h6>
                                            <small className="text-secondary-light">
                                                {companyTax.filedCount} Filed, {companyTax.pendingCount} Pending
                                            </small>
                                        </div>
                                    </div>
                                    <h6 className="text-md fw-medium mb-0">
                                        ${companyTax.totalAmount.toLocaleString()}
                                    </h6>
                                    <span className={`text-md fw-medium ${
                                        companyTax.status === 'Filed' ? 'text-success-main' : 'text-warning-main'
                                    }`}>
                                        {companyTax.status}
                                    </span>
                                    <div
                                        id={`markerTaxChart-${index}`}
                                        className="remove-tooltip-title rounded-tooltip-value"
                                    >
                                        {/* Pass the color value, height, width here */}
                                        {createChartFour(chartColor, 42, 100, filedPercentage)}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaxAnalytics;