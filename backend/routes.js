const express = require('express');
const router = express.Router();
const controller = require('./controller');
const m_config = require('./multer_config');

router.post('/api/parsePdfInsurance', m_config.upload.single('insuranceFile'), controller.parsePdfInsurance);
router.post('/api/createInsurance', controller.createInsurance);
router.put('/api/editInsurance', controller.editInsurance);
router.delete('/api/deleteInsurance/:id', controller.deleteInsurance);
router.get('/api/insurances', controller.getAllInsurances);
router.get('/api/status', controller.getStatus);

module.exports = router;
