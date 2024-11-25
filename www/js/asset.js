function toggleMenu() {
    const nav = document.querySelector('.nav-icons');
    nav.classList.toggle('open');
}

window.onload = function () {
// Calculate and display the totals when the page loads

const summaryNavBar = document.getElementById('summaryNavBar');
if (summaryNavBar) {
summaryNavBar.addEventListener('click', checkExpensesOnSummaryClick);
}
};


// Simulating income and expense data from localStorage
const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function calculateTotal(assetName) {
    const assetIncomes = incomes.filter(income => income.asset === assetName);
    const assetExpenses = expenses.filter(expense => expense.asset === assetName);

    const totalIncome = assetIncomes.reduce((total, income) => total + parseFloat(income.amountIncome), 0);
    const totalExpense = assetExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

    const totalAmount = totalIncome - totalExpense;

    return totalAmount.toFixed(2);
}

function showTransactions(assetName) {
    const assetTransactions = document.getElementById(`${assetName.toLowerCase()}Transactions`);
    const totalAmount = calculateTotal(assetName);
    const totalElement = document.getElementById(`${assetName.toLowerCase()}Total`);
    totalElement.innerHTML = `Total: $${totalAmount}`;

    assetTransactions.innerHTML = ''; // Clear previous transactions

    const assetIncomes = incomes.filter(income => income.asset === assetName);
    const assetExpenses = expenses.filter(expense => expense.asset === assetName);

    if (assetIncomes.length === 0 && assetExpenses.length === 0) {
        assetTransactions.innerHTML = '<p>No transactions found for this asset.</p>';
    } else {
        // Display incomes
        assetIncomes.forEach(income => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction-item', 'income');
            transactionItem.innerHTML = ` 
                <div style="display: flex; align-items: center;">
                    <img src="${income.icon}" alt="${income.category} Icon" style="width: 20px; height: 20px; margin-right: 10px;">
                    <span>${income.category}</span>
                </div>
                <div>
                    <span>${income.amountIncome}</span> 
                </div>
                <small>${new Date(income.date).toLocaleDateString()}</small>
            `;
            assetTransactions.appendChild(transactionItem);
        });

        // Display expenses
        assetExpenses.forEach(expense => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction-item', 'expense');
            transactionItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${expense.icon}" alt="${expense.category} Icon" style="width: 20px; height: 20px; margin-right: 10px;">
                    <span>${expense.category}</span>
                </div>
                <div>
                    <span>${expense.amount}</span> 
                </div>
                <small>${new Date(expense.date).toLocaleDateString()}</small>
            `;
            assetTransactions.appendChild(transactionItem);
        });
    }
}
document.getElementById('cashTotal').innerHTML = `Total: RM${calculateTotal('Cash')}`;
    document.getElementById('ewalletTotal').innerHTML = `Total: RM${calculateTotal('Ewallet')}`;
    document.getElementById('cardTotal').innerHTML = `Total: RM${calculateTotal('CardNumber')}`;
