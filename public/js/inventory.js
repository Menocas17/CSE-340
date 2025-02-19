'use strict'

let classificationList = document.querySelector('#classificationList');
classificationList.addEventListener('change', async ()=> {
    let classification_id = classificationList.value;
    console.log(classification_id);
    let classIdUrl = `/inv/getInventory/${classification_id}`;
    try {
        const response = await fetch(classIdUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);

        buildInventoryList(data);

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        
    }
})

function buildInventoryList(data) { 
    const inventoryDisplay = document.getElementById("inventoryDisplay"); 

    const dataTable = `
      <thead>
        <tr>
          <th>Vehicle Name</th>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </thead>
      <tbody>
        ${data.map(element => `
          <tr>
            <td>${element.inv_make} ${element.inv_model}</td>
            <td><a href='/inv/edit/${element.inv_id}' title='Click to update' class="action-button tb-btn">Modify</a></td>
            <td><a href='/inv/delete/${element.inv_id}' title='Click to delete' class="action-button tb-btn">Delete</a></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  
    inventoryDisplay.innerHTML = dataTable; 
}