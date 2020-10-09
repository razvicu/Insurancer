const express = require('express');
const router = express.Router();
const controller = require('./controller');

//router.post('/api/parsePdf', controller.parsePdf);
router.post('/api/createInsurance', controller.createInsurance);
router.put('/api/editInsurance', controller.editInsurance);
router.delete('/api/deleteInsurance/:id', controller.deleteInsurance);
router.get('/api/insurances', controller.getAllInsurances);
router.get('/api/status', controller.getStatus);

module.exports = router;
