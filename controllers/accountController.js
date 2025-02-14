const utilities = require('../utilities')
const accCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    const loginView = await utilities.buildLoginView()
    console.log(loginView)
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
      registerView
    })
}



  
module.exports = accCont