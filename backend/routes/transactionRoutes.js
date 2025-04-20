const express = require('express');
const { deleteAllTransactions,createTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction, getUserTransactions } = require('../controller/transactionController');
const { validateTransaction } = require('../middleware/transactionValidator');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/addtransaction', auth, validateTransaction, createTransaction);
router.get('/getalltransactions', auth, getTransactions);
router.get('/gettransaction/:id', auth, getTransaction);
router.put('/updatetransaction/:id', auth, /*validateTransaction,*/ updateTransaction);
router.delete('/deletetransaction/:id', auth, deleteTransaction);
router.delete('/deletetransaction', auth, deleteAllTransactions);
router.get('/mytransactions', auth, getUserTransactions);

module.exports = router;