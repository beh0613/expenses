
let selectedAssets = { from: null, to: null };
let currentInput = ""; // To store the current input
let operation = null; // To store the current operation (+, -, etc.)
let firstOperand = null; // To store the first operand

//Calculator oeration
function pressNumber(num) {
currentInput += num.toString(); // Append the number to the current input
updateAmountField();
}

// Function to add a decimal point
function addDecimal() {
if (!currentInput.includes(".")) {
currentInput += ".";
updateAmountField();
}
}

// Function to set the operation (+ or -)
function setOperation(op) {
if (currentInput) {
firstOperand = parseFloat(currentInput);
currentInput = "";
operation = op;
updateAmountField();
}
}

// Function to calculate the result
function calculate() {
if (firstOperand !== null && currentInput) {
const secondOperand = parseFloat(currentInput);
let result = 0;

if (operation === "+") {
result = firstOperand + secondOperand;
} else if (operation === "-") {
result = firstOperand - secondOperand;
}

// Update the current input with the result
currentInput = result.toString();
firstOperand = null;
operation = null;

updateAmountField();
}
}

// Function to delete the last entered character
function deleteLast() {
currentInput = currentInput.slice(0, -1); // Remove the last character
updateAmountField();
}


// Function to update the "Amount" input field
function updateAmountField() {
document.getElementById("amount").value = currentInput;
}
// Function to calculate asset amounts from localStorage
function getAssetAmounts() {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
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

// Function to display asset selection and handle updates
function selectAsset(type) {
    const assets = [
        { name: 'Cash', icon: 'image/incomeCash.png' },
        { name: 'Ewallet', icon: 'image/ewallet.png' },
        { name: 'CardNumber', icon: 'image/bankCard.png' }
    ];

    const assetAmounts = getAssetAmounts();

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
    title.textContent = `Select ${type === 'from' ? 'Source' : 'Destination'} Asset`;
    title.style.textAlign = "center";
    assetContainer.appendChild(title);

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
        text.textContent = `${asset.name} - $${assetAmounts[asset.name] || 0}`;
        text.style.flexGrow = "1";

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
            selectedAssets[type] = asset;
            updateAssetButton(type, asset);
            document.body.removeChild(assetContainer);
        });

        item.appendChild(img);
        item.appendChild(text);
        item.appendChild(selectButton);
        assetContainer.appendChild(item);
    });

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
    document.body.appendChild(assetContainer);
}

function updateAssetButton(type, asset) {
    const assetAmounts = getAssetAmounts();

    const button = document.getElementById(`asset-${type}-btn`);
    const span = document.getElementById(`asset-${type}-text`);
    span.textContent = `${asset.name} - $${assetAmounts[asset.name] || 0}`;
    button.style.backgroundImage = `url(${asset.icon})`;
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundPosition = "left center";
    button.style.backgroundSize = "30px";
}



function save() {
    const amount = parseFloat(document.getElementById('amount').value);
    const assetAmounts = getAssetAmounts();

    if (selectedAssets.from && selectedAssets.to && amount) {
        if (selectedAssets.from.name === selectedAssets.to.name) {
            alert("Cannot transfer to the same asset.");
            return;
        }

        if (amount > (assetAmounts[selectedAssets.from.name] || 0)) {
            alert("Insufficient funds in the source asset.");
            return;
        }

        // Update localStorage
        const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

        // Deduct from the "from" asset
        expenses.push({ asset: selectedAssets.from.name, amount });

        // Add to the "to" asset
        incomes.push({ asset: selectedAssets.to.name, amountIncome: amount });

        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('incomes', JSON.stringify(incomes));

        alert("Transfer successful!");

        // Refresh button labels with updated amounts
        updateAssetButton('from', selectedAssets.from);
        updateAssetButton('to', selectedAssets.to);
    } else {
        alert("Please select both assets and enter a valid amount.");
    }
}

// Initialize page with updated asset amounts
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initialized asset amounts:", getAssetAmounts());
});

//Reset
// Function to reset all fields
function resetFields() {
// Clear the current input and reset operands and operations
currentInput = "";
firstOperand = null;
operation = null;

// Reset the "Amount" field
updateAmountField();

// Reset the "Remark" and "Date" fields
document.getElementById("remark").value = "";
document.getElementById("expenseDate").value = "";

// Reset the selected assets (clear the buttons and text)
selectedAssets = { from: null, to: null };

// Reset the asset buttons to their default state
const assetFromButton = document.getElementById("asset-from-btn");
const assetToButton = document.getElementById("asset-to-btn");

const assetFromText = document.getElementById("asset-from-text");
const assetToText = document.getElementById("asset-to-text");

// Set the asset buttons back to default text
assetFromText.textContent = "+ Asset From";
assetToText.textContent = "+ Asset To";

// Optionally, remove any background images (if you set an icon or background image previously)
assetFromButton.style.backgroundImage = "";
assetToButton.style.backgroundImage = "";
}

