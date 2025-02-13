// Needed Resourses
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')

router.get('/type/:classificationId', invController.buildByClassificationId);

// Route for the deatiled vehicle view 
router.get('/detail/:inv_id', invController.buildVehicleDetailsById)

module.exports = router;