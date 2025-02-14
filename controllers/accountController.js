const utilities = require('../utilities')
const {registerAccount} = require('../models/account-model')
const accCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    const loginView = await utilities.buildLoginView()
    res.render("account/login", {
      title: "Login",
      nav,
      loginView
    })
}

accCont.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav()
    const registerView = await utilities.buildRegisterView()
    res.render("account/register", {
      title: "Register",
      nav,
      registerView,
      errors: null,
    })
}


accCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const registerView = await utilities.buildRegisterView()
  const loginView = await utilities.buildLoginView()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  console.log(account_password)

  const regResult = await registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      loginView
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      registerView

    })
  }
}



  
module.exports = accCont