// Needed Resourses
const express = require('express')
const utilities = require('../utilities')
const router = new express.Router()
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route for the deatiled vehicle view 
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildVehicleDetailsById));

router.get('', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildManagementView))

router.get('/newClassification', utilities.handleErrors(invController.buildNewClassificationtView))

router.get('/newInventory', utilities.handleErrors(invController.buildNewInventoryView))

router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:inv_id', utilities.handleErrors(invController.buildEditInv))

router.get('/delete/:inv_id', utilities.handleErrors(invController.deleteInventoryView))

router.post('', 
invValidate.newClassificationRules(),
invValidate.checkNewClassificaiton,
utilities.handleErrors(invController.addingNewClass))

router.post('/newInventory', 
invValidate.newInevntoryRules(),
invValidate.checkNeInventoryData,
utilities.handleErrors(invController.addingNewInv))

router.post('/edit/editInventory', 
invValidate.newInevntoryRules(),
invValidate.checkUpdate,
utilities.handleErrors(invController.editInventory))

router.post('/delete/deleteInventory', utilities.handleErrors(invController.deleteInventory))


module.exports = router;