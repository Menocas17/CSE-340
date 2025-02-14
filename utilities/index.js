const invModel = require('../models/inventory-model')
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

Util.buildLoginView = async function () {
  return `
  <div class="login-container">
    <form action="#" method="POST">
        <label for="email">Email:</label>
        <input type="email" id="email" name="account_email" required>

        <label for="password">Password:</label>
        <input type="password" id="password" name="account_password" pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{12,}$" required>

        <button type="submit" class="login-btn">LOGIN</button>
    </form>

    <p class="signup-link">No account? <a href="/account/register">Sign-up</a></p>
  </div>
  `
}

//Build the register view 

Util.buildRegisterView = async function () {
  return `

  <div class="container">
    <form action="/account/register" method="post">
      <label for="first-name">First name</label>
      <input type="text" id="first-name" name="account_firstname" required>

      <label for="last-name">Last name</label>
      <input type="text" id="last-name" name="account_lastname" required>

      <label for="email">Email address</label>
      <input type="email" id="email" name="account_email" required>

      <label for="password">Password</label>
      <input type="password" id="password" name="account_password" required
      pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{12,}$" 
            title="Password must be at least 12 characters long, contain one uppercase letter, one number, and one special character">

      <button type="submit" class="btn">Register</button>
    </form>
  </div>
  `
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)




module.exports = Util
