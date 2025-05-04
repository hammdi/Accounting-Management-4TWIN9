import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const TransactionOverview = () => {
    const [transactions, setTransactions] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([])
    const [activeTab, setActiveTab] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/mytransactions`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 5, sort: '-date' }
                })

                if (response.data.success) {
                    setTransactions(response.data.data)
                    setFilteredTransactions(response.data.data)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error)
                toast.error('Failed to load transactions')
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredTransactions(transactions)
        } else if (activeTab === 'highValue') {
            const highValue = [...transactions]
                .filter(tx => tx.amount > 1000) // Seuil pour transactions à haute valeur
                .sort((a, b) => b.amount - a.amount)
            setFilteredTransactions(highValue)
        }
    }, [activeTab, transactions])

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-success-focus text-success-main'
            case 'pending':
                return 'bg-warning-focus text-warning-main'
            case 'rejected':
                return 'bg-danger-focus text-danger-main'
            default:
                return 'bg-secondary-focus text-secondary-main'
        }
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    const handleAction = (transactionId, action) => {
        // Implémenter les actions selon les besoins
        console.log(`Action ${action} on transaction ${transactionId}`)
        toast.info(`Action ${action} triggered`)
    }

    if (loading) {
        return (
            <div className="col-xxl-6">
                <div className="card h-100">
                    <div className="card-body d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-header border-bottom bg-base ps-0 py-0 pe-24 d-flex align-items-center justify-content-between">
                    <ul className="nav bordered-tab nav-pills mb-0" id="transactions-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All Transactions
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'highValue' ? 'active' : ''}`}
                                onClick={() => setActiveTab('highValue')}
                            >
                                High Value
                            </button>
                        </li>
                    </ul>
                    <Link
                        to="/transaction-list"
                        className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                    >
                        View All
                        <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                    </Link>
                </div>
                <div className="card-body p-24">
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table mb-0">
                        <thead>
    <tr>
        <th scope="col">Transaction</th>
        <th scope="col">Company</th>
        <th scope="col">Date</th>
        <th scope="col">Status</th>
        <th scope="col">Amount</th>
        {/* Colonne Action supprimée */}
    </tr>
</thead>
<tbody>
    {filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction) => (
            <tr key={transaction._id}>
                <td>
                    <div>
                        <span className="text-md d-block line-height-1 fw-medium text-primary-light">
                            {transaction.description || 'No description'}
                        </span>
                        <span className="text-sm d-block fw-normal text-secondary-light">
                            #{transaction._id.slice(-6)}
                        </span>
                    </div>
                </td>
                <td>
                    {transaction.company?.name || 'Unknown'}
                </td>
                <td>{formatDate(transaction.date)}</td>
                <td>
                    <span className={`${getStatusBadge(transaction.status)} px-12 py-4 rounded-pill fw-medium text-sm`}>
                        {transaction.status}
                    </span>
                </td>
                <td className={`fw-semibold ${
                    transaction.type === 'Income' ? 'text-success-main' : 'text-danger-main'
                }`}>
                    {transaction.amount} DT
                </td>
                {/* Colonne Action supprimée */}
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5" className="text-center py-4 text-muted">
                No {activeTab === 'highValue' ? 'high value' : ''} transactions found
            </td>
        </tr>
    )}
</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionOverview