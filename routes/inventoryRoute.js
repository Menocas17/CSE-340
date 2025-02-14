// Needed Resourses
const express = require('express')
const utilities = require('../utilities')
const router = new express.Router()
const invController = require('../controllers/invController')

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route for the deatiled vehicle view 
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildVehicleDetailsById));

router.get('', utilities.handleErrors(invController.buildManagementView))

router.get('/newClassification', utilities.handleErrors(invController.buildNewClassificationtView))

router.get('/newInventory', utilities.handleErrors(invController.buildNewInventoryView))

module.exports = router;