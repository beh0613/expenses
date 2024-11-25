let selectedCategory = null;
let operation = null;
let amountField = "";
let currentOperationValue = 0;
let expenseDate = new Date();
let equalsPressed = false; // Tracks if '=' was pressed


function selectCategory(event, name, icon) {
    selectedCategory = { name, icon };

    // Highlight selected category
    const buttons = document.querySelectorAll('.category-item button');
    buttons.forEach(btn => {
        btn.classList.remove('selected'); // Remove previous selection
        btn.style.backgroundColor = ""; // Reset color
    });

    // Highlight the current selected button
    event.target.classList.add('selected');
    event.target.style.backgroundColor = "lightblue"; // Set color to blue when selected
}

function pressNumber(num) {
    amountField += num;
    document.getElementById('amount').value = amountField;
}

function addDecimal() {
    if (!amountField.includes(".")) {
        amountField += ".";
        document.getElementById('amount').value = amountField;
    }
}

function deleteLast() {
    amountField = amountField.slice(0, -1);
    document.getElementById('amount').value = amountField;
}

function setOperation(op) {
    if (amountField) {
        // Handle case when the field already has a value (e.g., from editing)
        if (!operation) {
            currentOperationValue = parseFloat(amountField);
        }
        operation = op;
        amountField += op; // Append operation to the amount field for display
        document.getElementById('amount').value = amountField;
    } else {
        alert("Please enter a number before selecting an operation!");
    }
}

function calculate() {
    if (operation && amountField) {
        // Split the amountField to retrieve the new value after the operation symbol
        const parts = amountField.split(operation);
        let newValue;

        if (parts.length > 1 && parts[1]) {
            newValue = parseFloat(parts[1]);
        } else {
            // If no second part exists, use 0 as the new value
            newValue = 0;
        }

        if (operation === "+") {
            currentOperationValue += newValue;
        } else if (operation === "-") {
            currentOperationValue -= newValue;
        }

        amountField = currentOperationValue.toString();
        operation = null;
        equalsPressed = true; // Mark that "=" was pressed
        document.getElementById('amount').value = amountField;
        document.getElementById('save-btn').disabled = false; // Enable the save button
    } else {
        alert("Please complete the operation before pressing '='!");
    }
}

function asset() {
    const assets = [
        { name: 'Cash', icon: 'image/incomeCash.png' },
        { name: 'Ewallet', icon: 'image/ewallet.png' },
        { name: 'CardNumber', icon: 'image/bankCard.png' }
    ];

    // Create a container to display the assets
    const assetContainer = document.createElement('div');
    assetContainer.style.position = "fixed";
    assetContainer.style.top = "50%";
    assetContainer.style.left = "50%";
    assetContainer.style.transform = "translate(-50%, -50%)";
    assetContainer.style.backgroundColor = "#fff";
    assetContainer.style.border = "1px solid #ccc";
    assetContainer.style.padding = "20px";
    assetContainer.style.borderRadius = "10px";
    assetContainer.style.width = "300px";
    assetContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    assetContainer.style.overflowY = "auto";
    assetContainer.style.maxHeight = "80%";

    const title = document.createElement('h3');
    title.textContent = "Select Asset";
    title.style.textAlign = "center";
    assetContainer.appendChild(title);

    let selectedAssetButton = null;

    // Loop through the available assets
    assets.forEach(asset => {
        const item = document.createElement('div');
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.marginBottom = "10px";
        item.style.padding = "10px";
        item.style.borderRadius = "8px";
        item.style.transition = "background-color 0.3s ease";

        const img = document.createElement('img');
        img.src = asset.icon;
        img.alt = asset.name;
        img.style.width = "30px";
        img.style.height = "30px";
        img.style.marginRight = "10px";

        const text = document.createElement('span');
        text.textContent = asset.name;
        text.style.flexGrow = "1";

        const amount = calculateAssetAmount(asset.name);
        const amountSpan = document.createElement('span');
        amountSpan.textContent = ` (RM${amount})`;
        amountSpan.style.marginLeft = "5px";
        amountSpan.style.color = "gray";

        // Add a "Select" button for each asset
        const selectButton = document.createElement('button');
        selectButton.textContent = "Select";
        selectButton.style.marginLeft = "10px";
        selectButton.style.backgroundColor = "#007bff";
        selectButton.style.color = "#fff";
        selectButton.style.border = "none";
        selectButton.style.padding = "5px";
        selectButton.style.borderRadius = "5px";
        selectButton.style.cursor = "pointer";
        selectButton.style.transition = "background-color 0.3s ease";

        selectButton.addEventListener('click', () => {
            // Handle the action for selecting the asset for income or expense
            alert(`You selected: ${asset.name}`);
            
            // Store the selected asset
            localStorage.setItem('selectedAsset', asset.name);
            localStorage.setItem('selectedAssetIcon', asset.icon); // Save icon path

            // Update the button's appearance
            if (selectedAssetButton) {
                selectedAssetButton.style.backgroundColor = "#007bff";
                selectedAssetButton.textContent = "Select";
            }
            selectButton.style.backgroundColor = "#28a745"; // Green for selected
            selectButton.textContent = "Selected";
            selectedAssetButton = selectButton;

            // Highlight the selected asset's container
            const items = assetContainer.querySelectorAll('div');
            items.forEach(i => i.style.backgroundColor = "#fff"); // Reset all
            item.style.backgroundColor = "#e6ffe6"; // Highlight the selected one
        });

        item.appendChild(img);
        item.appendChild(text);
        item.appendChild(amountSpan);
        item.appendChild(selectButton);
        assetContainer.appendChild(item);
    });

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = "Close";
    closeButton.style.marginTop = "20px";
    closeButton.style.width = "100%";
    closeButton.style.padding = "10px";
    closeButton.style.backgroundColor = "#007bff";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener('click', () => {
        document.body.removeChild(assetContainer);
    });

    assetContainer.appendChild(closeButton);

    // Append container to the body
    document.body.appendChild(assetContainer);
}

//New
function calculateAssetAmount(assetName) {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const assetAmounts = calculateAssetAmounts(incomes, expenses);

    return assetAmounts[assetName] || 0; // Return the calculated amount or 0 if not found
}

function calculateAssetAmounts(incomes, expenses) {
    const assetAmounts = {};

    incomes.forEach(record => {
        const { asset, amountIncome } = record;
        if (asset) {
            if (!assetAmounts[asset]) assetAmounts[asset] = 0;
            assetAmounts[asset] += amountIncome || 0;
        }
    });

    expenses.forEach(record => {
        const { asset, amount } = record;
        if (asset) {
            if (!assetAmounts[asset]) assetAmounts[asset] = 0;
            assetAmounts[asset] -= amount || 0;
        }
    });

    return assetAmounts;
}


function quickAdd_save() {
    // Check if an operation was selected and equals was pressed
    if (operation && !equalsPressed) {
        alert("Please complete the calculation by pressing '=' before saving.");
        return;
    }

    const amount = parseFloat(document.getElementById('amount').value);
    const remark = document.getElementById('remark').value;
    const dateInput = document.getElementById('expenseDate').value;
    
    // Parse the date with moment.js
    const expenseDate = dateInput ? moment(dateInput, 'YYYY-MM-DD').toDate() : null; // If date is provided, convert to Date object

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    // Ensure an asset is selected
    const selectedAsset = localStorage.getItem('selectedAsset');
    if (!selectedAsset) {
        alert("Please select an asset!");
        return;
    }

    // Get the existing record if editing
    const recordIndex = localStorage.getItem('editRecordIndex');
    const records = JSON.parse(localStorage.getItem('expenses')) || [];

    let expenseRecord;

    if (recordIndex !== null) {
        // Editing an existing record
        expenseRecord = records[recordIndex];

        // If the user selects a new category, update it
        if (selectedCategory) {
            expenseRecord.category = selectedCategory.name;
            expenseRecord.icon = selectedCategory.icon;
        }

        // Always update the amount and remark, retain the existing date unless updated
        expenseRecord.amount = amount;
        expenseRecord.remark = remark;

        // Update the date only if it's provided (not null)
        if (expenseDate) {
            expenseRecord.date = moment(expenseDate).toISOString(); // Use moment.js for consistent date format
        }

        // Ensure asset is updated (if applicable)
        expenseRecord.asset = selectedAsset;

    } else {
        // For a new record, ensure category is selected
        if (!selectedCategory) {
            alert("Please select a category!");
            return;
        }

        expenseRecord = {
            category: selectedCategory.name,
            icon: selectedCategory.icon,
            asset: selectedAsset,
            assetIcon: localStorage.getItem('selectedAssetIcon'), // Include the asset icon
            amount,
            date: moment(expenseDate).toISOString(), // Use moment.js for the date format
            remark
        };

        records.push(expenseRecord);
    }

    // Save the updated records back to localStorage
    localStorage.setItem("expenses", JSON.stringify(records));
    alert("Expense saved!");
    equalsPressed = false;  // Reset equalsPressed after saving
}


function quickAdd() {
    quickAdd_save();
    resetFields();
}

function save() {
     // Check if an operation was selected and equals was pressed
     if (operation && !equalsPressed) {
        alert("Please complete the calculation by pressing '=' before saving.");
        return;
    }

    const amount = parseFloat(document.getElementById('amount').value);
    const remark = document.getElementById('remark').value;
    const dateInput = document.getElementById('expenseDate').value;
    
    // Parse the date with moment.js
    const expenseDate = dateInput ? moment(dateInput, 'YYYY-MM-DD').toDate() : null; // If date is provided, convert to Date object

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    // Ensure an asset is selected
    const selectedAsset = localStorage.getItem('selectedAsset');
    if (!selectedAsset) {
        alert("Please select an asset!");
        return;
    }

    // Get the existing record if editing
    const recordIndex = localStorage.getItem('editRecordIndex');
    const records = JSON.parse(localStorage.getItem('expenses')) || [];

    let expenseRecord;

    if (recordIndex !== null) {
        // Editing an existing record
        expenseRecord = records[recordIndex];

        // If the user selects a new category, update it
        if (selectedCategory) {
            expenseRecord.category = selectedCategory.name;
            expenseRecord.icon = selectedCategory.icon;
        }

        // Always update the amount and remark, retain the existing date unless updated
        expenseRecord.amount = amount;
        expenseRecord.remark = remark;

        // Update the date only if it's provided (not null)
        if (expenseDate) {
            expenseRecord.date = moment(expenseDate).toISOString(); // Use moment.js for consistent date format
        }

        // Ensure asset is updated (if applicable)
        expenseRecord.asset = selectedAsset;

    } else {
        // For a new record, ensure category is selected
        if (!selectedCategory) {
            alert("Please select a category!");
            return;
        }

        expenseRecord = {
            category: selectedCategory.name,
            icon: selectedCategory.icon,
            asset: selectedAsset,
            assetIcon: localStorage.getItem('selectedAssetIcon'), // Include the asset icon
            amount,
            date: moment(expenseDate).toISOString(), // Use moment.js for the date format
            remark
        };

        records.push(expenseRecord);
    }

    // Save the updated records back to localStorage
    localStorage.setItem("expenses", JSON.stringify(records));
    alert("Expense saved!");
    equalsPressed = false;  // Reset equalsPressed after saving
    resetFields();
    window.location.href = 'record.html'; // Adjust the redirection URL as needed

}


function resetFields() {
    const buttons = document.querySelectorAll('.category-item button');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        btn.style.backgroundColor = "";
    });

    selectedCategory = null;
    amountField = "";
    currentOperationValue = 0;
    operation = null;
    equalsPressed = false;
    document.getElementById('amount').value = "";
    document.getElementById('remark').value = "";
    document.getElementById('expenseDate').value = "";
    document.querySelector('.calculator button:last-child').disabled = true;
    document.getElementById('save-btn').disabled = true;
}



window.onload = function () {
    setDefaultDate();
    loadRecordForEditing();
};

function setDefaultDate() {
    const dateInput = document.getElementById('expenseDate');
    if (!dateInput.value) { // Only set the default if no value is already set
        const today = moment().format('YYYY-MM-DD'); // Using moment.js to get the current date
        dateInput.value = today;
    }
}


function loadRecordForEditing() {
    const editRecordIndex = localStorage.getItem('editRecordIndex');

    if (editRecordIndex !== null) {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const record = expenses[editRecordIndex];

        // If the record exists, populate the form with the existing data
        if (record) {
            // Set the form fields with the current record data
            amountField = record.amount.toString(); // Pre-fill the amount field
            currentOperationValue = parseFloat(record.amount); // Set the current value
            document.getElementById('amount').value = amountField;
            document.getElementById('remark').value = record.remark;

            // Format the date using moment.js
            const date = moment(record.date).format('YYYY-MM-DD'); // Format to 'yyyy-mm-dd'
            document.getElementById('expenseDate').value = date;

            // Preserve the selected category
            selectCategoryByName(record.category, record.icon); // This will highlight the existing category button
        }
    }
}

function selectCategoryByName(name, icon) {
    // Find all category buttons
    const buttons = document.querySelectorAll('.category-item button');

    // Loop through and find the button that matches the record's category
    buttons.forEach(button => {
        if (button.textContent.trim() === name) {
            // Keep the current selection (do not change if it's already selected)
            button.classList.add('selected');
            button.style.backgroundColor = "lightblue"; // Highlight the selected category
        } else {
            // Remove the selected class from others if needed
            button.classList.remove('selected');
            button.style.backgroundColor = ""; // Reset the background for non-selected categories
        }
    });
}