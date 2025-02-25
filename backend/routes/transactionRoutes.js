const express = require('express');
const { createTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction } = require('../controller/transactionController');
const { validateTransaction } = require('../middleware/transactionValidator');

const router = express.Router();

router.post('/addtransaction', validateTransaction,createTransaction);
router.get('/getalltransactions', getTransactions);
router.get('/gettransaction/:id', getTransaction);
router.put('/updatetransaction/:id', validateTransaction,updateTransaction);
router.delete('/deletetransaction/:id', deleteTransaction);

module.exports = router;