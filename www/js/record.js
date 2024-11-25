function toggleMenu() {
    const nav = document.querySelector('.nav-icons');
    nav.classList.toggle('open');
}
//Profile pic
// Retrieve the profile picture URL from localStorage
const selectedImage = localStorage.getItem('selectedProfilePicture');

// If an image was selected, display it beside the header
if (selectedImage) {
    const headerElement = document.querySelector('.header');
    const profileImage = document.createElement('img');
    profileImage.src = selectedImage;
    profileImage.alt = 'User Profile Picture';
    profileImage.style.width = '50px';
    profileImage.style.height = '50px';
    profileImage.style.borderRadius = '50%';
    profileImage.style.marginLeft = '10px';

    headerElement.appendChild(profileImage);
}

function checkExpensesOnSummaryClick(event) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (expenses.length === 0) {
        event.preventDefault(); // Prevent navigating to the summary page
        alert("No expenses recorded. Please add your expenses.");
    }
}

window.onload = function () {
    ensureDefaultAssetIcons();
    displayRecords();
    calculateTotals();
    displayUsername();

    const summaryNavBar = document.getElementById('summaryNavBar');
    if (summaryNavBar) {
        summaryNavBar.addEventListener('click', checkExpensesOnSummaryClick);
    }
};

function ensureDefaultAssetIcons() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(expense => {
        if (!expense.assetIcon) {
            expense.assetIcon = 'path/to/default-asset-icon.png'; // Add a default asset icon
        }
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function displayUsername() {
    const username = localStorage.getItem('currentUser');
    if (username) {
        document.getElementById('usernameDisplay').textContent = `Hello, ${username}`;
    }
}

function displayRecords() {
    const recordsContainer = document.getElementById('recordsContainer');
    if (!recordsContainer) {
        console.error("Element with id 'recordsContainer' not found.");
        return;
    }

    recordsContainer.innerHTML = ''; // Clear previous records

    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    console.log('Incomes:', incomes);
    console.log('Expenses:', expenses);

    const allRecords = [
        ...incomes.map((record, index) => ({ ...record, type: 'income', index })),
        ...expenses.map((record, index) => ({ ...record, type: 'expense', index }))
    ];

    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('All Records:', allRecords);

    if (allRecords.length === 0) {
        console.warn("No records to display.");
        recordsContainer.innerHTML = '<p>No records found.</p>';
        return;
    }

    let currentDate = null;

    allRecords.forEach((record) => {
        const fullDate = new Date(record.date).toLocaleDateString();

        if (fullDate !== currentDate) {
            currentDate = fullDate;
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.innerHTML = `<h4>${fullDate}</h4>`;
            recordsContainer.appendChild(dateHeader);
        }

        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        recordDiv.innerHTML = `
        <div class="details">
            <img src="${record.icon || 'path/to/default-icon.png'}" alt="${record.category}" class="category-icon">
            <span class="category">${record.category}</span>
        </div>
        <span class="amount ${record.type === 'income' ? 'green' : 'red'}">
            ${record.type === 'income' ? '+' : '-'} ${parseFloat(record.amountIncome || record.amount || 0).toFixed(2)}
        </span>
        <span class="remark">${record.remarkIncome || record.remark || ''}</span>
        <div class="buttons">
            <button class="edit-btn" onclick="editRecord(${record.index}, ${record.type === 'expense'})">
                <img src="image/edit.gif" alt="Edit" width="30px" height="30px">
            </button>
            <button class="delete-btn" onclick="deleteRecord(${record.index}, ${record.type === 'expense'})">
                <img src="image/delete.gif" alt="Delete" width="30px" height="30px">
            </button>
        </div>
    `;
    
    
        recordsContainer.appendChild(recordDiv);
    });
}



function editRecord(index, isExpense) {
    const key = isExpense ? "expenses" : "incomes";
    const records = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem('editRecordIndex', index);

    if (isExpense) {
        window.location.href = "addExpenses.html";
    } else {
        window.location.href = "addIncome.html";
    }
}

function addNewExpense() {
    localStorage.removeItem('editRecordIndex');
    document.getElementById('amountExpense').value = '';
    document.getElementById('remarkExpense').value = '';
    document.getElementById('expenseDate').value = '';
    document.getElementById('categoryIcon').src = '';
    document.getElementById('categoryIcon').src || 'path/to/default-asset-icon.png'; // Default if missing
}

function addNewIncome() {
    localStorage.removeItem('editRecordIndex');
    document.getElementById('amountIncome').value = '';
    document.getElementById('remarkIncome').value = '';
    document.getElementById('expenseDate').value = '';
    document.getElementById('categoryIcon').src = '';
}

function deleteRecord(index, isExpense) {
    const key = isExpense ? "expenses" : "incomes";
    let records = JSON.parse(localStorage.getItem(key)) || [];
    records.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(records));
    displayRecords();
    calculateTotals();
}

function calculateTotals() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];

    const totalExpenses = expenses.reduce((total, record) => total + parseFloat(record.amount || 0), 0);
    const totalIncome = incomes.reduce((total, record) => total + parseFloat(record.amountIncome || 0), 0);

    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
}