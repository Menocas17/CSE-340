const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require('../models/inventory-model')

const validate = {}

validate.newInevntoryRules = () => {
    return [
        body('inv_make')
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage('Please provide a valid make name'),

        body('inv_model')
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage('Please provide a valid model name'),

        body('inv_description')
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 10})
        .withMessage('Description must be at least 10 characters long'),

        body('inv_image')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide a valid image path'),

        body('inv_thumbnail')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide a valid image thumbnail path'),

        body('inv_price')
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage('Please provide a valid price'),

        body('inv_year')
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isInt({ min: 1940, max: 2025 }).withMessage('Year must be a four-digit number between 1940 and 2025')
        .isLength({ min: 4, max: 4 }).withMessage('Year must be exactly 4 digits'),

        body('inv_miles')
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage('Please provide a valid miles number'),

        body('inv_color')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide valid color name'),

        
    ]
}
validate.newClassificationRules = () => {
    return [
        body('classification_name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please provide a classificaiton name')
        .matches(/^[A-Za-z]+$/).withMessage('Classification name must contain only letters without spaces'),
    ]
}

validate.checkNewClassificaiton = async (req,res,next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('inventory/newClassification', {
            title: 'Add New Classification',
            errors,
            nav,
            classification_name,
        })
        return
    }
    next()
}

validate.checkNeInventoryData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
    const classData = await invModel.getClassifications()
    const classifications = classData.rows

    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('inventory/newInventory', {
            errors,
            title: 'Add New Inventory',
            nav,
            classifications,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
        })

        return
    }

    next()
}

module.exports = validate