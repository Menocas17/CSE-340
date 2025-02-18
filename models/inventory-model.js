const pool = require('../database/')

// Get all classification data 

async function getClassifications () {
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}

// Get all inventory items and classification_name by classification_id

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        console.log(data)
        return data.rows
        
    }

    catch (error) {
        console.error('getclassificationsbyid error' + error)
    }
}

async function getVehicleDetailsById (inv_id) {
    try {
        const details = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inv_id]
        )
            
        return details.rows
    }

    catch (error){
        console.error('getVehicledDetails error' + error)
    }
}

// adding the new classification 

async function addNewClassification (classification_name) {
    try {
        const sql = 'INSERT INTO public.classification (classification_name)VALUES ($1) RETURNING *'
        return await pool.query(sql, [classification_name])

    } catch (error){
        return error.message
    }
}


//adding new inventory
async function addNewInventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = 'INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])

    } catch (error){
        console.error('Error inserting new inventory:', error.message)
        return error.message
    }
}

// update inventory 
async function updateInventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id) {

    console.log('Updating inventory with values:');
    console.log({ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id });
    try {
        const sql = 'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *'
        const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])

        return data.rows [0]

    } catch (error){
        console.error("model error: " + error)
    }
}

// delete vehicle

async function deleteInventoryFromDB (inv_id) {
    try {
        const sql = 'DELETE FROM public.inventory WHERE inv_id = $1'
        return await pool.query(sql, [inv_id])

    } catch (error){
        console.error('Error deleting inventory:', error.message)
        return error.message
    }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleDetailsById, addNewClassification, addNewInventory, updateInventory, deleteInventoryFromDB};
