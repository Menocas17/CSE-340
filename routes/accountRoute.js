// Needed Resourses
const express = require('express')
const utilities = require('../utilities')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')



router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get('/register', utilities.handleErrors(accountController.buildRegister));


router.post('/register', 
regValidate.registationRules(),
regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login",

regValidate.loginRules(),
regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )


module.exports = router;