const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

// Build inventory by classification view 

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render('./inventory/classification', {
        title: className + ' vehicles',
        nav,
        grid,
    })
}

// Build the details view 

invCont.buildVehicleDetailsById = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    const data = await invModel.getVehicleDetailsById(inv_id)
    const detailsView = await utilities.buildVehicleDetailsView(data)
    let nav = await utilities.getNav()
    const title = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render('./inventory/details', {
        title: title,
        nav,
        detailsView
    })
}

module.exports = invCont