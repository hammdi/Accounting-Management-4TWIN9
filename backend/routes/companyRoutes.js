const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompany, updateCompany, deleteCompany } = require('../controller/companyController');
const { validateCompany } = require('../middleware/companyValidator');

router.post('/addcompany',validateCompany, createCompany);
router.get('/getallcompanies', getCompanies);
router.get('/getcompany/:id', getCompany);
router.put('/updatecompany/:id',validateCompany, updateCompany);
router.delete('/deletecompany/:id', deleteCompany);

module.exports = router;