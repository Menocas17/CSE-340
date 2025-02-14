// Needed Resourses
const express = require('express')
const utilities = require('../utilities')
const router = new express.Router()
const accountController = require('../controllers/accountController')


router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get('/register', utilities.handleErrors(accountController.buildRegister));

module.exports = router;