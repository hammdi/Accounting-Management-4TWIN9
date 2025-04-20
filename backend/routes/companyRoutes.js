const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompany, updateCompany, deleteCompany,getUserCompanies } = require('../controller/companyController');
const { validateCompany } = require('../middleware/companyValidator');
const auth = require('../middleware/auth');

router.post('/addcompany',auth,/*validateCompany,*/ createCompany);
router.get('/getallcompanies',auth, getCompanies);
router.get('/getcompany/:id',auth, getCompany);
router.put('/updatecompany/:id',auth, validateCompany, updateCompany);
router.delete('/deletecompany/:id', auth, deleteCompany);
router.get('/mycompanies', auth, getUserCompanies);

module.exports = router;