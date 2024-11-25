function toggleMenu() {
    const nav = document.querySelector('.nav-icons');
    nav.classList.toggle('open');
}



document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year-select");
    const yearSelectMonthly = document.getElementById("year-select-monthly");
    const monthSelect = document.getElementById("month-select");
    const yearlyChartCtx = document.getElementById("yearly-chart").getContext("2d");
    const monthlyChartCtx = document.getElementById("monthly-chart").getContext("2d");
    const dailyChartCtx = document.getElementById("daily-chart").getContext("2d");
    const categoryExpensesContainer = document.getElementById("category-expenses");
    const totalExpensesAmount = document.getElementById("total-expenses-amount");

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const uniqueYears = [...new Set(expenses.map(expense => moment(expense.date).year()))];


    uniqueYears.forEach(year => {
        const option1 = document.createElement("option");
        option1.value = year;
        option1.textContent = year;
        yearSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = year;
        option2.textContent = year;
        yearSelectMonthly.appendChild(option2);
    });

    let yearlyChart, monthlyChart, dailyChart;

    function displayNoDataMessage(chartContainer) {
        // Store the original canvas
        const canvas = chartContainer.querySelector('canvas');
        if (canvas) {
            // Hide the canvas instead of removing it
            canvas.style.display = 'none';
        }

        // Remove existing no-data message if it exists
        const existingMessage = chartContainer.querySelector('.no-data');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add new no-data message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-data';
        messageDiv.innerHTML = `
        <img src="./image/empty.png" alt="No data available">
        <p>Oops! No information for this period.</p>
    `;
        chartContainer.appendChild(messageDiv);
    }

    function clearNoDataMessage(chartContainer) {
        // Remove no-data message if it exists
        const noDataDiv = chartContainer.querySelector('.no-data');
        if (noDataDiv) {
            noDataDiv.remove();
        }

        // Show the canvas again
        const canvas = chartContainer.querySelector('canvas');
        if (canvas) {
            canvas.style.display = 'block';
        }
    }


    function updateYearlyChart(selectedYear) {
        const monthlyTotals = Array(12).fill(0);

        expenses.forEach(expense => {
            const date = moment(expense.date);
            if (date.year() === selectedYear) {
                monthlyTotals[date.month()] += parseFloat(expense.amount || 0);
            }
        });

        const hasData = monthlyTotals.some(value => value > 0);

        if (!hasData) {
            displayNoDataMessage(document.getElementById("yearly-chart").parentNode);
            return;
        }

        if (yearlyChart) yearlyChart.destroy();
        yearlyChart = new Chart(yearlyChartCtx, {
            type: "bar",
            data: {
                labels: moment.months(),
                datasets: [
                    {
                        label: `Expenses in ${selectedYear}`,
                        data: monthlyTotals,
                        backgroundColor: [
                            '#B5D8EB', '#A7C5EB', '#C3E6E3', '#B5EAD7',
                            '#C7CEEA', '#ABC7E3', '#B6DCFE', '#9DB6D4',
                            '#CAE3F5', '#BFD4DB', '#A2D2DF', '#C0E6FF'
                        ],
                        borderColor: '#BDB2FF',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Yearly Expenses Overview - ${selectedYear}`,
                        color: '#1e3a8a',  // Changed to dark blue
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: "'Comic Sans MS', cursive, sans-serif"
                        },
                        padding: {
                            top: 0,
                            bottom:0
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#D5AAFF', // Keeping the pink color for legend
                            font: {
                                family: "'Comic Sans MS', cursive, sans-serif",
                                size: 10,
                            },
                            padding: 15,
                            pointStyle: 'rect',  // This makes the legend marker a rectangle
                            usePointStyle: true,  // This is needed for the pointStyle to work
                            pointBackgroundColor: '#D5AAFF'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#FFF4F4',
                        bodyColor: '#FF69B4',
                        titleColor: '#FF69B4',
                        borderWidth: 1,
                        borderColor: '#FFB6C1',
                        cornerRadius: 10,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                        },
                        bodyFont: {
                            size: 12,
                        },
                        callbacks: {
                            label: function (context) {
                                return `RM${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (RM)',
                            color: '#1e3a8a',  // Changed to match title color
                            font: {
                                family: "'Comic Sans MS', cursive, sans-serif",
                                size: 10,  // Increased size
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 5  // Added padding
                            }
                        },
                        ticks: {
                            color: '#6B7AEF',
                            font: {
                                size:6
                            },
                            callback: function (value) {
                                return 'RM' + value.toFixed(2);
                            }
    
                        },
                        grid: {
                            color: 'rgba(189, 178, 255, 0.1)'   // Light pink grid lines
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month',
                            color: '#1e3a8a',  // Changed to match title color
                            font: {
                                family: "'Comic Sans MS', cursive, sans-serif",
                                size: 10,  // Increased size
                                weight: 'bold'
                            },
                            padding: {
                                top: 5  // Added padding
                            }
                        },
                        ticks: {
                            color: '#6B7AEF',
                            font: {
                                size: 6
                            },
                        },
                        grid: {
                            display: false  // Removed vertical grid lines for cleaner look
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 0,
                        bottom: 10
                    }
                }
            },
        });
    }

    function updateYearlyTotal(selectedYear) {
        const yearlyTotalContainer = document.getElementById("yearly-total-amount");
        let totalAmount = 0;

        expenses.forEach(expense => {
            const date = moment(expense.date);
            if (date.year() === selectedYear) {
                totalAmount += parseFloat(expense.amount || 0);
            }
        });

        if (totalAmount === 0) {
            yearlyTotalContainer.innerHTML = `
            <p class="yearly-total-info">
                Total Expenses for ${selectedYear} is
                <strong>RM0.00</strong>
            </p>
        `;
        } else {
            yearlyTotalContainer.innerHTML = `
            <p class="yearly-total-info">
                Total Expenses for ${selectedYear} is
                <strong>RM${totalAmount.toFixed(2)}</strong>
            </p>
        `;
        }
    }
    
    function updateMonthlyChart(selectedYear, selectedMonth) {
        const chartContainer = document.getElementById("monthly-chart").parentNode;
        const categoryTotals = {};
        expenses.forEach(expense => {
            const date = moment(expense.date);
            if (date.year() === selectedYear && date.month() === selectedMonth) {
                const category = expense.category || "Other";
                categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount || 0);
            }
        });

        const categories = Object.keys(categoryTotals);
        const totals = Object.values(categoryTotals);

        if (categories.length === 0) {
            displayNoDataMessage(document.getElementById("monthly-chart").parentNode);
            updateMonthlyDetails(selectedYear, selectedMonth, true);
            return;
        }
        clearNoDataMessage(chartContainer);

        if (monthlyChart) monthlyChart.destroy();
        monthlyChart = new Chart(monthlyChartCtx, {
            type: "pie",
            data: {
                labels: categories,
                datasets: [
                    {
                        label: `Category Breakdown for ${moment.months()[selectedMonth]}`,
                        data: totals,
                        backgroundColor: [
                            '#A0C4FF', // Soft blue
                            '#BDB2FF', // Lavender
                            '#D5AAFF', // Soft purple
                            '#A0E7E5', // Aqua
                            '#C4FAF8', // Light teal
                            '#85E3FF', // Pastel blue
                            '#FFC6FF', // Light pink-purple
                            '#AFCBFF', // Ice blue
                            '#D7BDE2', // Pale purple
                            '#AEDFF7'  // Sky blue
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        hoverOffset: 10, // Adds a hover effect
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Monthly Expenses - ${moment.months()[selectedMonth]} ${selectedYear}`,
                        color: '#33475b',  
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: "'Comic Sans MS', cursive, sans-serif"
                        },
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    },
                    tooltip: {
                        backgroundColor: '#AFCBFF', // Light pink for tooltip
                        bodyColor: '#AFCBFF', // Hot pink text
                        borderWidth: 1,
                        borderColor: '#FFB6C1', // Light coral
                        cornerRadius: 10, // Rounded tooltips
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                        },
                        bodyFont: {
                            size: 12,
                        },
                        displayColors: false, // Removes small box indicators
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#33475b', // Soft pink labels
                            font: {
                                family: "'Comic Sans MS', cursive, sans-serif",
                                size: 14,
                            },
                            padding: 15,
                        },
                    },
                },
                layout: {
                    padding: 20, // Adds space around the chart
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'easeInOutBounce', // Cute animation effect
                        from: 1,
                        to: 0,
                        loop: true,
                    },
                },
            },
        });


        updateMonthlyDetails(selectedYear, selectedMonth, false);
    }

    function updateDailyChart(selectedYear, selectedMonth) {
        const chartContainer = document.getElementById("daily-chart").parentNode;
        const daysInMonth = moment(`${selectedYear}-${selectedMonth + 1}`, "YYYY-M").daysInMonth();
        const dailyTotals = Array(daysInMonth).fill(0);

        // Filter expenses for selected month and year
        const monthExpenses = expenses.filter(expense => {
            const date = moment(expense.date);
            return date.year() === selectedYear && date.month() === selectedMonth;
        });

        // Calculate daily totals
        monthExpenses.forEach(expense => {
            const day = moment(expense.date).date() - 1; // Convert to 0-based index
            dailyTotals[day] += parseFloat(expense.amount || 0);
        });

        const hasData = dailyTotals.some(value => value > 0);

        if (!hasData) {
            displayNoDataMessage(chartContainer);
            return;
        }
        clearNoDataMessage(chartContainer);
        // Create labels for all days in the month
        const labels = Array.from(
            { length: daysInMonth },
            (_, i) => `${i + 1}`
        );

        if (dailyChart) {
            dailyChart.destroy();
        }

        dailyChart = new Chart(dailyChartCtx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Daily Expenses",
                    data: dailyTotals,
                    borderColor: "#33475b",  // Soft purple line
                    backgroundColor: "rgba(189, 178, 255, 0.1)",
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#BDB2FF",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Daily Expenses - ${moment.months()[selectedMonth]} ${selectedYear}`,
                        color: '#33475b',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#9D91FF', 
                            font: {
                                family: "'Comic Sans MS', cursive, sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#F8F7FF',  // Very light purple background
                        titleColor: '#33475b',  // Soft purple for title
                        bodyColor: '#9D91FF',   // Soft purple for body
                        borderColor: '#BDB2FF', // Soft purple border
                        borderWidth: 1,
                        cornerRadius: 10,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return `RM${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Day of Month',
                            color: '#9D91FF'
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#33475b',
                            font: {
                                size:6
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount (RM)',
                            color: '#33475b'
                        },
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(189, 178, 255, 0.1)'
                        },
                        ticks: {
                            color: '#33475b',
                            font: {
                                size: 6
                            },
                            callback: function (value) {
                                return 'RM' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }


    function updateMonthlyDetails(selectedYear, selectedMonth, noData = false) {
        const categoryExpensesContainer = document.getElementById("category-expenses");
        const totalExpensesAmount = document.getElementById("total-expenses-amount");
        categoryExpensesContainer.innerHTML = "";

        if (noData) {
            categoryExpensesContainer.innerHTML = '<li class="no-data-message">No information for this month. 😞</li>';
            totalExpensesAmount.innerHTML = `
                <p class="total-expenses-info">
                    Total for <span>${moment.months()[selectedMonth]}, ${selectedYear}</span>: <strong>RM0.00</strong>
                </p>
            `;
            return;
        }

        const categoryIcons = {
            "Food": "./image/iconFood.png",
            "Fruits": "./image/iconFruits.png",
            "Drink": "./image/iconDrink.png",
            "Dessert": "./image/iconDessert.png",
            "Car": "./image/iconCar.png",
            "Bus": "./image/iconBus.png",
            "Clothes": "./image/iconClothes.png",
            "Comestic": "./image/iconComestic.png",
            "Delivery": "./image/iconDelivery.png",
            "Fuel": "./image/iconFuel.png",
            "Game": "./image/iconGame.png",
            "Medical": "./image/iconMedical.png",
            "Pet": "./image/iconPet.png",
            "Restaurant": "./image/iconRestaurant.png",
            "Shopping": "./image/iconShopping.png",
            "Sport": "./image/iconSport.png",
            "Tool": "./image/iconTool.png",
            "Travel": "./image/iconTravel.png",
            "Vegetable": "./image/iconVegetable.png",
            "Feed":"./image/iconFeed.png"
        };

        const categoryTotals = {};
        let total = 0;

        expenses.forEach(expense => {
            const date = moment(expense.date);
            if (date.year() === selectedYear && date.month() === selectedMonth) {
                const category = expense.category || "Other";
                categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount || 0);
                total += parseFloat(expense.amount || 0);
            }
        });

        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const percentage = ((amount / total) * 100).toFixed(2); // Calculate percentage
            const icon = categoryIcons[category] || categoryIcons["Other"]; // Fallback to default icon
            const listItem = document.createElement("li");
            listItem.className = "category-detail-item";
            listItem.innerHTML = `
            <img src="${icon}" alt="${category}" class="category-icon">
            <span class="category-name">${category}</span>: RM${amount.toFixed(2)} 
            (<strong>${percentage}%</strong>)
        `;
            categoryExpensesContainer.appendChild(listItem);
        });

        totalExpensesAmount.innerHTML = `
            <p class="total-expenses-info">
                Total for <span>${moment.months()[selectedMonth]}, ${selectedYear}</span>: <strong>RM${total.toFixed(2)}</strong>
            </p>
        `;
    }

    yearSelect.addEventListener("change", () => {
        const selectedYear = parseInt(yearSelect.value);
        updateYearlyChart(selectedYear);
        updateYearlyTotal(selectedYear);
    });

    yearSelectMonthly.addEventListener("change", () => {
        const selectedYear = parseInt(yearSelectMonthly.value);
        const selectedMonth = parseInt(monthSelect.value);
        updateMonthlyChart(selectedYear, selectedMonth);
        updateDailyChart(selectedYear, selectedMonth);
    });

    monthSelect.addEventListener("change", () => {
        const selectedYear = parseInt(yearSelectMonthly.value);
        const selectedMonth = parseInt(monthSelect.value);
        updateMonthlyChart(selectedYear, selectedMonth);
        updateDailyChart(selectedYear, selectedMonth);
    });

    if (uniqueYears.length > 0) {
        const defaultYear = uniqueYears.includes(currentYear) ? currentYear : uniqueYears[0];
        const defaultMonth = uniqueYears.includes(currentYear) ? currentMonth : 0;

        yearSelect.value = defaultYear;
        yearSelectMonthly.value = defaultYear;
        monthSelect.value = defaultMonth;

        updateYearlyChart(defaultYear);
        updateYearlyTotal(defaultYear);
        updateMonthlyChart(defaultYear, defaultMonth);
        updateDailyChart(defaultYear, defaultMonth);
    }
});











