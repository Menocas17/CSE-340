const invModel = require('../models/inventory-model')
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

// Constructs teh nav HTML unordered list 

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  

  let list = `
      <ul>
          <li><a href="/" title="Home Page">Home</a></li>
          ${data.rows.map(row => `
              <li>
                  <a href="/inv/type/${row.classification_id}" title="See our Inventory of ${row.classification_name} vehicles">
                      ${row.classification_name}
                  </a>
              </li>
          `).join('')}
      </ul>
  `;

  return list;
}



// Build the classidicatio view HTML 

Util.buildClassificationGrid = async function (data) {
    if (data.length === 0) {
        return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
      }
    
      const gridItems = data.map(vehicle => `
        <li class="card category-card">
          <a href="../../inv/detail/${vehicle.inv_id}" 
             title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" 
                 alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" >
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" 
                 title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>
      `).join('');
    
      return `<ul id="inv-display">${gridItems}</ul>`;
};


// Build the Details view in HTML 

Util.buildVehicleDetailsView = async function(data) {
  if(data.length === 0){
    return 'Sorry we do not currently have details for this vehicle, come again soon!'
  } else {
    const vehicleDetails = data[0]

    return `
          <div class="details-grid">
              <img src="${vehicleDetails.inv_image}" alt="${vehicleDetails.invModel} ${vehicleDetails.inv_make}">

              <div>
                  <h2>${vehicleDetails.inv_make} ${vehicleDetails.inv_model} Deteails</h2>
                  <p><strong>Price:</strong> $ ${new Intl.NumberFormat('en-US').format(vehicleDetails.inv_price)}</p>
                  <p><strong>Description:</strong> ${vehicleDetails.inv_description}</p>
                  <p><strong>Color:</strong> ${vehicleDetails.inv_color}</p>
                  <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicleDetails.inv_miles)}</p>
              </div>
          </div>
    `
  }
}

// Build the login view 


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// Check the user authorization 

Util.checkAdminOrEmployee = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash('notice', 'You need to log in to access this page.');
    return res.redirect('account/login'); 
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      req.flash('notice', 'Invalid token. Please log in again.');
      return res.redirect('account/login'); 
    }

    if (user.account_type === 'Employee' || user.account_type === 'Admin') {
      req.user = user;  
      return next();  
    }

    req.flash('notice', 'You do not have permission to access this page.');
    return res.redirect('account/management'); 
  });
}



module.exports = Util
