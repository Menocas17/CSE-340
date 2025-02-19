'use strict'

//get the classification table 
const classTable = document.querySelector('#classificationDisplay');

//getting the data to populate the classification table

const getClassificationData = async () => {
    try {
        const response = await fetch('/inv/getClassification');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        buildClassificationTable(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

//build the classification table

const buildClassificationTable = (data) => {
    //clear the table
    classTable.innerHTML = `
    <thead>
        <tr>
            <th>Classification Name</th>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
    `

    const tbody = classTable.querySelector('tbody');
    //build the table
    data.forEach((classification) => {
        const row = tbody.insertRow()
        row.innerHTML = `
            <td>${classification.classification_name}</td>
            <td><a href='/inv/editClassification/${classification.classification_id}' title='Click to update' class="action-button tb-btn">Edit Name</a></td>
            <td>
                <form class="delete-class-form" action="/inv/deleteClassification/${classification.classification_id}" method="POST" onsubmit="return confirm('Are you sure you want to delete this classification?');">
                    <input type="hidden" name="classification_id" value="${classification.classification_id}">
                    <button type="submit" class="action-button tb-btn">Delete</button>
                </form>
            </td>
        `;
    });
}

getClassificationData();