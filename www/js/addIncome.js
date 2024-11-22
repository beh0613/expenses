let previousAmount = 0;
let selectedCategory = null;
let operation = null;
let amountField = ""; // Holds the arithmetic expression as a string
let currentOperationValue = 0;
let equalsPressed = false;

// Function to select category and toggle color
// Function to select category and toggle color
function selectCategory(event, name, icon) {
    selectedCategory = { name, icon };
    // Highlight selected category
    const buttons = document.querySelectorAll('.category-item button');
    buttons.forEach(btn => {
        btn.classList.remove('selected'); // Remove previous selection
        btn.style.backgroundColor = ""; // Reset color
    });
    event.target.classList.add('selected'); // Highlight current selection
    event.target.style.backgroundColor = "lightblue"; // Set color to blue when selected
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


// Handle number inputs
function pressNumber(num) {
    amountField += num; // Append number to the field
    document.getElementById('amountIncome').value = amountField; // Display expression
}

// Add decimal point
function addDecimal() {
    if (!amountField.includes(".")) {
        amountField += ".";
        document.getElementById('amountIncome').value = amountField;
    }
}

// Delete the last character
function deleteLast() {
    amountField = amountField.slice(0, -1);
    document.getElementById('amountIncome').value = amountField;
}



// Modify the setOperation function to add a dynamic amount when "+" is pressed

function calculate() {
    try {
        const result = eval(amountField); // Safely evaluate the expression
        amountField = result.toString();
        currentOperationValue = result;
        operation = null;
        document.getElementById('amountIncome').value = amountField;
    } catch (error) {
        alert("Invalid calculation. Please correct your input.");
    }
}


function setOperation(op) {
    if (amountField) {
        if (operation) {
            // Store the current input value into previousAmount when the user presses the operation for the first time
            previousAmount = parseFloat(amountField);
        }
        // Append the operation to the existing field
        amountField += ` ${op} `;
        operation = op;  // Set the operation
        document.getElementById('amountIncome').value = amountField; // Update input display
    } else {
        alert("Please enter a number before selecting an operation!");
    }
}





// Initialize the editing process when the page loads
window.onload = function () {
    // Check if we are editing an existing record
    const editRecordIndex = localStorage.getItem('editRecordIndex');
    if (editRecordIndex !== null) {
        loadIncomeRecordForEditing(editRecordIndex);
    }
};

function loadIncomeRecordForEditing(index) {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const record = incomes[index];

    // Populate the fields with the existing record's data
    document.getElementById('amountIncome').value = record.amountIncome;
    previousAmount = parseFloat(record.amountIncome); // Store the previous amount

    document.getElementById('remarkIncome').value = record.remarkIncome;
    document.getElementById('incomeDate').value = new Date(record.date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    // Set the selected category (based on the stored category name)
    selectedCategory = { name: record.category, icon: record.icon };
    highlightCategoryButton(record.category);

    // If the icon is a string (URL or file path), set it directly
    const iconPath = record.icon;  // Assuming it's just a string (URL)
    if (iconPath) {
        document.getElementById('categoryIcon').src = iconPath;  // Set the image source to the icon URL
    }
}



function highlightCategoryButton(categoryName) {
    const buttons = document.querySelectorAll('.category-item button');
    buttons.forEach(button => {
        // Use case-insensitive comparison if necessary
        if (button.textContent.trim().toLowerCase() === categoryName.toLowerCase()) {
            button.classList.add('selected');
            button.style.backgroundColor = "lightblue"; // Highlight selected category
        }
    });
}

function quickAddIncome() {
    if (operation && !equalsPressed) {
        alert("Please complete the calculation by pressing '=' before saving.");
        return;
    }
    const amountIncome = parseFloat(document.getElementById('amountIncome').value);
    const remarkIncome = document.getElementById('remarkIncome').value;

    // Validate the amount
    if (isNaN(amountIncome) || amountIncome <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    // Validate category selection
    if (!selectedCategory) {
        alert("Please select a category!");
        return;
    }

    // Use the selected asset or default to 'Cash'
    const selectedAsset = localStorage.getItem('selectedAsset') || 'Cash';

    // Use the selected date or default to today's date in YYYY-MM-DD format
    const incomeDate = document.getElementById('incomeDate').value || new Date().toISOString().split('T')[0];

    // Create the income record
    const incomeRecord = {
        category: selectedCategory.name,
        icon: selectedCategory.icon,
        amountIncome,
        remarkIncome,
        date: incomeDate,
        asset: selectedAsset, // Store asset type
    };

    // Fetch or initialize incomes from localStorage
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];

    // Check if editing an existing record
    const editRecordIndex = localStorage.getItem('editRecordIndex');
    if (editRecordIndex !== null && editRecordIndex !== "null") {
        // Update the record
        incomes[editRecordIndex] = incomeRecord;
        localStorage.removeItem('editRecordIndex'); // Clear edit mode
    } else {
        // Add new income
        incomes.push(incomeRecord);
    }

    // Save the updated incomes to localStorage
    localStorage.setItem('incomes', JSON.stringify(incomes));

    // Clear input fields
    document.getElementById('amountIncome').value = '';
    document.getElementById('remarkIncome').value = '';
    document.getElementById('incomeDate').value = '';

    // Provide feedback
    alert("Income added successfully!");
    resetFields();
}

function saveIncome() {
    if (operation && !equalsPressed) {
        alert("Please complete the calculation by pressing '=' before saving.");
        return;
    }
    const amountIncome = parseFloat(document.getElementById('amountIncome').value);
    const remarkIncome = document.getElementById('remarkIncome').value;

    // Validate the amount
    if (isNaN(amountIncome) || amountIncome <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    // Validate category selection
    if (!selectedCategory) {
        alert("Please select a category!");
        return;
    }

    // Use the selected asset or default to 'Cash'
    const selectedAsset = localStorage.getItem('selectedAsset') || 'Cash';

    // Use the selected date or default to today's date in YYYY-MM-DD format
    const incomeDate = document.getElementById('incomeDate').value || new Date().toISOString().split('T')[0];

    // Create the income record
    const incomeRecord = {
        category: selectedCategory.name,
        icon: selectedCategory.icon,
        amountIncome,
        remarkIncome,
        date: incomeDate,
        asset: selectedAsset, // Store asset type
    };

    // Fetch or initialize incomes from localStorage
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];

    // Check if editing an existing record
    const editRecordIndex = localStorage.getItem('editRecordIndex');
    if (editRecordIndex !== null && editRecordIndex !== "null") {
        // Update the record
        incomes[editRecordIndex] = incomeRecord;
        localStorage.removeItem('editRecordIndex'); // Clear edit mode
    } else {
        // Add new income
        incomes.push(incomeRecord);
    }

    // Save the updated incomes to localStorage
    localStorage.setItem('incomes', JSON.stringify(incomes));

    // Clear input fields
    document.getElementById('amountIncome').value = '';
    document.getElementById('remarkIncome').value = '';
    document.getElementById('incomeDate').value = '';

    // Provide feedback
    alert("Income added successfully!");
    resetFields();
    window.location.href = 'record.html'; // Navigate to the records page

}


// Reset fields after saving or canceling
function resetFields() {
    selectedCategory = null;
    amountField = "";
    currentOperationValue = 0;
    operation = null;
    document.getElementById('amountIncome').value = "";
    document.getElementById('remarkIncome').value = "";
    document.querySelectorAll('.category-item button').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.backgroundColor = ""; // Reset color
    });
}