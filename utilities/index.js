const invModel = require('../models/inventory-model')
const Util = {}

// Constructs teh nav HTML unordered list 

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = '<ul>'
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li>'
        list +=
            '<a href="/inv/type/' + 
            row.classification_id +
            '"title="See our Inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    });
    list += "</ul>"

    return list 
}

module.exports = Util

// Build the classidicatio view HTML 

Util.buildClassificationGrid = async function (data) {
    if (data.length === 0) {
        return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
      }
    
      const gridItems = data.map(vehicle => `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" 
             title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" 
                 alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
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
