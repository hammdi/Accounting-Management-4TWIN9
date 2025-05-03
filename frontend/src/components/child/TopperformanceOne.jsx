import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const TopTransactions = () => {
    const [topTransactions, setTopTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTopTransactions = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/mytransactions`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.data.success) {
                    processTransactionData(response.data.data)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error)
                toast.error('Failed to load transaction data')
            } finally {
                setLoading(false)
            }
        }

        const processTransactionData = (transactions) => {
            // Get top 6 transactions by amount
            const sortedTransactions = [...transactions]
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 6)
                .map(tx => ({
                    ...tx,
                    completion: calculateCompletion(tx)
                }))

            setTopTransactions(sortedTransactions)
        }

        // Example completion calculation based on transaction status and amount
        const calculateCompletion = (transaction) => {
            if (transaction.status === 'approved') return 100
            if (transaction.status === 'pending') return Math.min(90, Math.floor(transaction.amount / 100))
            return Math.min(50, Math.floor(transaction.amount / 50))
        }

        fetchTopTransactions()
    }, [])

    if (loading) {
        return (
            <div className="col-xxl-4">
                <div className="card">
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
        <div className="col-xxl-4">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Top Transaction companies</h6>
                        <Link
                            to="/transactions"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>
                    <div className="mt-32">
                        {topTransactions.map((transaction, index) => (
                            <div key={index} className="d-flex align-items-center justify-content-between gap-3 mb-32">
                                <div className="d-flex align-items-center">
                                    <div className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden bg-primary-100 d-flex justify-content-center align-items-center">
                                        <Icon 
                                            icon={transaction.type === 'Income' ? 
                                                "fluent:arrow-trending-lines-20-filled" : 
                                                "fluent:arrow-trending-down-20-filled"}
                                            className={`icon ${transaction.type === 'Income' ? 'text-success-main' : 'text-danger-main'}`}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="text-md mb-0">
                                            {transaction.company?.name || 'Unknown Company'}
                                        </h6>
                                        <span className="text-sm text-secondary-light fw-medium">
                                            {transaction.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="text-md fw-semibold d-block">
                                        {transaction.amount} DT
                                    </span>
                                    <span className={`text-xs fw-medium ${
                                        transaction.status === 'approved' ? 'text-success-main' :
                                        transaction.status === 'pending' ? 'text-warning-main' : 'text-danger-main'
                                    }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopTransactions