import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/mytransactions`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 5, sort: '-date' }
                })

                if (response.data.success) {
                    setTransactions(response.data.data)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error)
                toast.error('Failed to load recent transactions')
            } finally {
                setLoading(false)
            }
        }

        fetchRecentTransactions()
    }, [])

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

    if (loading) {
        return (
            <div className="col-xxl-6">
                <div className="card h-100">
                    <div className="card-body d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
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
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 className="text-lg fw-semibold mb-0">Recent Transactions</h6>
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
                                    <th scope="col">Transaction ID</th>
                                    <th scope="col">Company</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <tr key={transaction._id}>
                                            <td className="text-nowrap">{transaction._id.slice(-8)}</td>
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No transactions found
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

export default RecentTransactions