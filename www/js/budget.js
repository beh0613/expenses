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
    const summaryNavBar = document.getElementById('summaryNavBar');
    if (summaryNavBar) {
        summaryNavBar.addEventListener('click', checkExpensesOnSummaryClick);
    }
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
    const remainingBudget = budget - totalExpenses; // Allow negative values for exceeded budget
    const dailyAllowance = (remainingBudget / remainingDays).toFixed(2); // Allow negative values for daily allowance
    const remainingPercentage = ((remainingBudget / budget) * 100).toFixed(2);

    // Update budget period and remaining days
    $('#budget-period').text(`${start.format('MMM 1')} to ${end.format('MMM D, YYYY')}`);
    $('#remaining-days').text(remainingDays);

    // Update remaining amount
    const remainingAmountElement = $('#remaining-amount');
    remainingAmountElement.text(Math.abs(remainingBudget).toFixed(2));
    if (remainingBudget < 0) {
        remainingAmountElement.css('color', 'red');
        remainingAmountElement.text(`-${Math.abs(remainingBudget).toFixed(2)}`);
    } else {
        remainingAmountElement.css('color', ''); // Reset color
    }

    // Update remaining percentage
    const remainingPercentageElement = $('#remaining-percentage');
    remainingPercentageElement.text(Math.abs(remainingPercentage).toFixed(2));
    if (remainingBudget < 0) {
        remainingPercentageElement.css('color', 'red');
        remainingPercentageElement.text(`-${Math.abs(remainingPercentage).toFixed(2)}`);
    } else {
        remainingPercentageElement.css('color', ''); // Reset color
    }

    // Update daily allowance
    const dailyAllowanceElement = $('#daily-allowance');
    dailyAllowanceElement.text(dailyAllowance);
    if (remainingBudget < 0) {
        dailyAllowanceElement.css('color', 'red');
    } else {
        dailyAllowanceElement.css('color', ''); // Reset color
    }
}




function calculateTotalExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    // Filter expenses to include only those within the current month
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = moment(expense.date); // Parse the expense date
        return expenseDate.isBetween(startOfMonth, endOfMonth, 'days', '[]'); // Inclusive of start and end dates
    });

    // Calculate the total of filtered expenses
    return currentMonthExpenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
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





