const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');

router.post('/', licenseController.enterCar);
router.route('/:noPlate').get(licenseController.getCar).patch(licenseController.exitCar);

module.exports = router