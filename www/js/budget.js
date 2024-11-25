function toggleMenu() {
    const nav = document.querySelector('.nav-icons');
    nav.classList.toggle('open');
}

// Prevent access to the summary page if no expenses exist
function checkExpensesOnSummaryClick(event) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (expenses.length === 0) {
        event.preventDefault(); // Prevent navigation
        alert("No expenses recorded. Please add your expenses before accessing the summary page.");
        return false; // Stop further event propagation
    }
    // Allow navigation if expenses exist
}

// Show a modal when no expenses are recorded (this function can be used as needed)
function showNoExpensesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h4>No Expenses Recorded</h4>
            <p>Please add expenses before accessing the summary page.</p>
            <button id="close-modal" class="btn btn-primary">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
}

// Variables
// Variables
let budget = 0;

// Check for Existing Budget
$(document).ready(function () {
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
        budget = parseFloat(savedBudget);
        showBudgetDisplay();
    } else {
        showBudgetInput();
    }

    $('#set-budget').click(setBudget);
    $('#edit-budget').click(editBudget);
});

// Function to Show Budget Input Section
function showBudgetInput() {
    $('#budget-section').removeClass('d-none');
    $('#budget-display-section').addClass('d-none');
    $('#budget-summary').addClass('d-none');
}

// Function to Show Budget Display Section
function showBudgetDisplay() {
    $('#budget-section').addClass('d-none');
    $('#budget-display-section').removeClass('d-none');
    $('#displayed-budget').text(budget.toFixed(2));
    $('#budget-summary').removeClass('d-none');
    displayBudgetSummary();
}

// Set Budget
function setBudget() {
    const newBudget = parseFloat($('#budget-input').val());
    if (isNaN(newBudget) || newBudget <= 0) {
        alert('Please enter a valid budget amount.');
        return;
    }

    budget = newBudget;
    localStorage.setItem('budget', budget);
    showBudgetDisplay();
}

// Edit Budget
function editBudget() {
    $('#budget-section').removeClass('d-none');
    $('#budget-display-section').addClass('d-none');
    $('#budget-summary').addClass('d-none');
    $('#budget-input').val(budget).focus();
}

// Display Budget Summary
function displayBudgetSummary() {
    const now = moment();
    const start = moment(now).startOf('month');
    const end = moment(now).endOf('month');
    const remainingDays = end.diff(now, 'days') + 1; // Include today

    const totalExpenses = calculateTotalExpenses();
    const remainingBudget = Math.max(budget - totalExpenses, 0);
    const dailyAllowance = (remainingBudget / remainingDays).toFixed(2);

    $('#budget-period').text(`${start.format('MMM 1')} to ${end.format('MMM D, YYYY')}`);
    $('#remaining-days').text(remainingDays);
    $('#remaining-amount').text(remainingBudget.toFixed(2));
    $('#daily-allowance').text(dailyAllowance);
}

// Calculate Total Expenses (Dummy Function)
function calculateTotalExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
}



// Enable Summary Button After Adding Expenses
function addExpense(category, amount) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ category, amount: parseFloat(amount), date: moment().toISOString() });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    const summaryNavBar = document.getElementById('summaryNavBar');
    if (summaryNavBar) {
        summaryNavBar.classList.remove('disabled');
    }

    displayBudgetSummary(expenses); // Recalculate budget after adding expense
}





