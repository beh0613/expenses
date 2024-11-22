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
        operation = op;
        currentOperationValue = parseFloat(amountField);
        amountField += op; // Append operation to the amount field
        document.getElementById('amount').value = amountField;
    } else {
        alert("Please enter a number before selecting an operation!");
    }
}


function calculate() {
    if (operation && amountField) {
        let newValue = parseFloat(amountField.split(operation)[1]);
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

    // Loop through the available assets
    assets.forEach(asset => {
        const item = document.createElement('div');
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.marginBottom = "10px";

        const img = document.createElement('img');
        img.src = asset.icon;
        img.alt = asset.name;
        img.style.width = "30px";
        img.style.height = "30px";
        img.style.marginRight = "10px";

        const text = document.createElement('span');
        text.textContent = asset.name;
        text.style.flexGrow = "1";

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

        selectButton.addEventListener('click', () => {
            // Handle the action for selecting the asset for income or expense
            alert(`You selected: ${asset.name}`);
            // Store the selected asset in localStorage or use it in the next step (income/expense handling)
            localStorage.setItem('selectedAsset', asset.name);
            document.body.removeChild(assetContainer); // Close modal
        });

        item.appendChild(img);
        item.appendChild(text);
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



function quickAdd_save() {
    // Check if an operation was selected and equals was pressed
    if (operation && !equalsPressed) {
        alert("Please complete the calculation by pressing '=' before saving.");
        return;
    }

    const amount = parseFloat(document.getElementById('amount').value);
    const remark = document.getElementById('remark').value;
    const dateInput = document.getElementById('expenseDate').value;
    const expenseDate = dateInput ? new Date(dateInput) : null; // Don't override the date if not changed

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
            expenseRecord.date = expenseDate.toLocaleString();  // If date is provided, update it
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
            amount,
            remark,
            date: expenseDate ? expenseDate.toLocaleString() : new Date().toLocaleString(),
            asset: selectedAsset, // Store asset type
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

    if (!selectedCategory) {
        alert("Please select a category!");
        return;
    }

    const amount = parseFloat(document.getElementById('amount').value);
    const remark = document.getElementById('remark').value;
    const dateInput = document.getElementById('expenseDate').value;

    const expenseDate = dateInput ? new Date(dateInput) : new Date();

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    const expenseRecord = {
        category: selectedCategory.name,
        icon: selectedCategory.icon,
        amount,
        remark,
        date: new Date(expenseDate),
        asset: localStorage.getItem('selectedAsset') // Store the selected asset
    };

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expenseRecord);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    alert("Expense saved!");
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
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format: yyyy-mm-dd
        dateInput.value = formattedDate;
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
            document.getElementById('amount').value = record.amount;
            document.getElementById('remark').value = record.remark;
            const date = new Date(record.date);
            document.getElementById('expenseDate').value = date.toISOString().split('T')[0]; // Set date input to yyyy-mm-dd format

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