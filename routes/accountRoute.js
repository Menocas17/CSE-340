// Needed Resourses
const express = require('express')
const utilities = require('../utilities')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')



router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.get('/management', utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))


router.post('/register', 
regValidate.registationRules(),
regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login",
regValidate.loginRules(),
regValidate.checkLoginData,
utilities.handleErrors(accountController.accountLogin)
)



module.exports = router;