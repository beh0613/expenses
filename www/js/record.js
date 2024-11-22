function toggleMenu() {
    const nav = document.querySelector('.nav-icons');
    nav.classList.toggle('open');
}
window.onload = function () {
    displayRecords();
    calculateTotals();
    displayUsername();
};

function displayUsername() {
    const username = localStorage.getItem('currentUser');
    if (username) {
        document.getElementById('usernameDisplay').textContent = `Hello, ${username}`;
    }
}

function displayRecords() {
    const recordsContainer = document.getElementById('recordsContainer');
    recordsContainer.innerHTML = ''; // Clear previous records

    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const allRecords = [
        ...incomes.map((record, index) => ({ ...record, type: 'income', index })),
        ...expenses.map((record, index) => ({ ...record, type: 'expense', index }))
    ];

    // Sort records by date (descending)
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentDate = null;

    allRecords.forEach((record) => {
        const fullDate = new Date(record.date).toLocaleDateString();

        // Add a date header if the date changes
        if (fullDate !== currentDate) {
            currentDate = fullDate;
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.innerHTML = `<h4>${fullDate}</h4>`;
            recordsContainer.appendChild(dateHeader);
        }

        // Create the record item
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        recordDiv.innerHTML = `
                    <div class="details">
                        <img src="${record.icon || 'path/to/default-icon.png'}" alt="${record.category}" class="category-icon">
                        <span class="category">${record.category}</span>
                    </div>
                    <span class="amount ${record.type === 'income' ? 'green' : 'red'}">
                        ${record.type === 'income' ? '+' : '-'} ${parseFloat(record.amountIncome || record.amount).toFixed(2)}
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