const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')
const {addNewClassification, addNewInventory} = require('../models/inventory-model')

const invCont = {}

// Build inventory by classification view 

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render('inventory/classification', {
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
    res.render('inventory/details', {
        title: title,
        nav,
        detailsView
    })
}

// Build the management view 

invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await invModel.getClassifications()
    const classifications = classificationSelect.rows
    res.render('inventory/management', {
        title: 'Vehicle Management',
        nav,
        classifications,
        errors: null,
    })
}

// Build the new classification view 

invCont.buildNewClassificationtView = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render('inventory/newClassification', {
        title: 'Add New Classification',
        nav,
        errors: null,
    })
}

// adding the new classification to the databse 

invCont.addingNewClass = async function (req, res) {
    const {classification_name} = req.body

    const newClassResult = await addNewClassification(classification_name)

    if(newClassResult) {

        let nav = await utilities.getNav()
        req.flash(
            'notice',
            `New Classification, ${classification_name} has been succesfully added`
        )

        res.redirect('/inv'); 
    } else {
        req.flash('notice', 'Sorry we could not add the new classification')
        res.status(501).render('inventory/newClassification', {
            title: 'Add New Classification',
            nav,
            errors: null,
        })
    }
}

//Build the new inventory view 
invCont.buildNewInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classData = await invModel.getClassifications()
    const classifications = classData.rows
    res.render('inventory/newInventory', {
        title: 'Add New Inventory',
        nav,
        classifications,
        errors: null,
    })
}

//adding new inventory to the database

invCont.addingNewInv = async function (req, res) {
    let nav = await utilities.getNav()
    const classData = await invModel.getClassifications()
    const classifications = classData.rows
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body

    const newInvResult = await addNewInventory(
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    )

    if(newInvResult) {
        req.flash(
            'notice',
            `New Inventory, ${inv_make} ${inv_model} has been succesfully added`
        )

        res.redirect('/inv'); 

    } else {
        req.flash('notice', 'Sorry we could not add the new inventory')
        res.status(501).render('inventory/newInventory', {
            title: 'Add New Inventory',
            nav,
            classifications,
            errors: null,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

invCont.buildEditInv = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const classData = await invModel.getClassifications()
    const classifications = classData.rows
    const rawData = await invModel.getVehicleDetailsById(inv_id)
    const invData = rawData[0];
    let nav = await utilities.getNav()
    const title = `Edit ${invData.inv_make} ${invData.inv_model}`
    res.render('inventory/editInventory', {
        title: title,
        nav,
        classifications,
        inv_make: invData.inv_make,
        inv_id: invData.inv_id,
        inv_model: invData.inv_model,
        inv_year: invData.inv_year,
        inv_description: invData.inv_description,
        inv_image: invData.inv_image,
        inv_thumbnail: invData.inv_thumbnail,
        inv_price: invData.inv_price,
        inv_miles: invData.inv_miles,
        inv_color: invData.inv_color,
        classification_id: invData.classification_id,
        errors: null,
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.editInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
    const updateResult = await invModel.updateInventory( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id
    )

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv")
    } else {
      const classData = await invModel.getClassifications()
      const classifications = classData.rows
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classifications,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  }


/* ***************************
Build the delete view 
    * ************************** */

invCont.deleteInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav(),
    inv_id = req.params.inv_id
    const data = await invModel.getVehicleDetailsById(inv_id)
    const title = `Delete ${data[0].inv_make} ${data[0].inv_model}`
    res.render('inventory/deleteInventory', {
        title,
        nav,
        inv_id,
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_year: data[0].inv_year,
        inv_price: data[0].inv_price,
        errors: null,
    })
}

invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {inv_id} = req.body
    const deleteResult = await invModel.deleteInventoryFromDB(inv_id)
    if (deleteResult) {
      req.flash("notice", "The item was successfully deleted.")
      res.redirect("/inv")
    } else {
      const data = await invModel.getVehicleDetailsById(inv_id)
      const title = `Delete ${data[0].inv_make} ${data[0].inv_model}`
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("inventory/deleteInventory", {
        title,
        nav,
        inv_id,
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_year: data[0].inv_year,
        inv_price: data[0].inv_price,
        errors: null,
      })
    }   
}

// controller for the manage classificiation View

invCont.manageClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('inventory/manageClassification', {
        title: 'Manage Classification',
        nav,
        errors: null,
    })
}

// controller for getting the edit classification view 

invCont.editClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classication_id = req.params.classification_id
    const classification = await invModel.getClassificationByID(classication_id)
    console.log('classification:', classification)
    res.render('inventory/editClassification', {
        title: `Edit ${classification.classification_name} name`,
        nav,
        classification_name: classification.classification_name,
        classication_id,
        errors: null,
    })
}

// controller for handling the delete classification

invCont.deleteClassification = async function (req, res, next) {
    const {classification_id} = req.body
    console.log('classification_id:', classification_id)
    const classificationList = await invModel.getInventoryByClassificationId(classification_id)
    console.log('classificationList:', classificationList)
    if (classificationList.length > 0) {
        req.flash('notice', 'Sorry, you cannot delete a classification that has inventory, try deleting the inventory first')
        res.redirect('/inv')
    } else {
        const deleteResult = await invModel.deleteClassificationFromDB(classification_id)
        if (deleteResult) {
            req.flash('notice', 'The classification was successfully deleted')
            res.redirect('/inv')
        } else {
            req.flash('notice', 'Sorry, the delete failed')
            res.redirect('/inv/deleteClassification')
        }
    }
}


// controller for handeling the edit clssification 

invCont.editClassificationData = async function (req, res, next) {
    const classification_id = req.params.classification_id
    const classification_name = req.body.classification_name
    console.log('classification_id:', classification_id)
    console.log('classification_name:', classification_name)
    const updateResult = await invModel.updateClassification(classification_name, classification_id)
    if (updateResult) {
        req.flash('notice', 'The classification was successfully updated')
        res.redirect('/inv')
    } else {
        const classification = await invModel.getClassificationByID(classification_id)
        req.flash('notice', 'Sorry, the update failed')
        res.render('inventory/editClassification', {
            title: `Edit ${classification.classification_name} name`,
            classification_name: classification.classification_name,
            errors: null,
        })
    }
}

// controller for getting the classification JSON data

invCont.getClassificationsJSON = async function (req, res, next) {
    const Data = await invModel.getClassifications()
    const classData = Data.rows
    if (classData[0].classification_id) {
        console.log(classData)
      return res.json(classData)
    } else {
      next(new Error("No data returned"))
    }
}

module.exports = invCont