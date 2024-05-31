document.addEventListener('DOMContentLoaded', function() {
    // Load Population data
    // Define the variable to hold population data
    let usa;

    // Load Population data
    fetch('population.json')
        .then(response => response.json())
        .then(data => {
            // Store the data in the variable
            usa = data;

            // Process the population data for the chart
            const statePopulation = usa.reduce((acc, item) => {
                const state = item.State;
                const population = parseInt(item.Population.replace(/,/g, ''), 10);

                if (!acc[state]) {
                    acc[state] = 0;
                }
                acc[state] += population;
                return acc;
            }, {});

            // Sort the states by population and get the top 5
            const sortedStates = Object.entries(statePopulation)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);

            const topStates = sortedStates.map(([state]) => state);
            const topPopulations = sortedStates.map(([, population]) => population);

            // Create the bar chart
            const barPopulationDistributionCtx = document.getElementById("bar-population-distribution").getContext("2d");

            new Chart(barPopulationDistributionCtx, {
                type: "bar",
                data: {
                    labels: topStates,
                    datasets: [{
                        label: "Population",
                        data: topPopulations,
                        backgroundColor: ["#D6C096"],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });

            // Calculate the total population
            const totalPopulation = usa.reduce((total, item) => {
                const populationNumber = parseInt(item.Population.replace(/,/g, ''), 10);
                return total + populationNumber;
            }, 0);

            // Update the DOM with the total population
            document.getElementById('total-population').querySelector('.body-stat').textContent = totalPopulation.toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching population data:', error);
        });
    
     
    // Define the variable to hold superstore data
    let superstore;

    // Load Superstore data
    fetch('superstore.json')
        .then(response => response.json())
        .then(data => {
            // Store the data in the variable
            superstore = data;
            
            function getUniqueStates(data) {
                const states = data.map(item => item.State);
                return [...new Set(states)];
            }
            
            function populateStateFilter(states) {
                const stateSelect = document.getElementById('state');
                states.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state;
                    option.textContent = state;
                    stateSelect.appendChild(option);
                });
            }
    
            // This should be inside the fetch block to ensure data is loaded first
            const uniqueStates = getUniqueStates(superstore);
            populateStateFilter(uniqueStates);
            

            // Calculate Total Users
            const uniqueCustomers = new Set(superstore.map(item => item.Customer_ID));
            const totalUsers = uniqueCustomers.size;

            // Calculate Sales Quantity
            const salesQuantity = superstore.reduce((total, item) => total + parseFloat(item.Quantity), 0);

            // Calculate Total Profit
            const totalProfit = superstore.reduce((total, item) => total + parseFloat(item.Profit), 0);

            // Update in the HTML
            document.getElementById('total-user').querySelector('.body-stat').textContent = totalUsers;
            document.getElementById('total-sales').querySelector('.body-stat').textContent = salesQuantity.toFixed(0);
            document.getElementById('total-profit').querySelector('.body-stat').textContent = `$${totalProfit.toFixed(0)}`;

            // Sales Distribution
            const stateQuantity = superstore.reduce((acc, item) => {
                if (!acc[item.State]) {
                    acc[item.State] = 0;
                }
                acc[item.State] += parseFloat(item.Quantity);
                return acc;
            }, {});

            const sortedState = Object.entries(stateQuantity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);

            const topState = sortedState.map(([state]) => state);
            const topQuantity = sortedState.map(([, quantity]) => quantity);

            const barSalesDistributionCtx = document.getElementById("bar-sales-distribution").getContext("2d");

            new Chart(barSalesDistributionCtx, {
                type: "bar",
                data: {
                    labels: topState,
                    datasets: [{
                        label: "Quantity",
                        data: topQuantity,
                        backgroundColor: ["#D6C096"],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Segment by Quantity
            const segmentQuantity = superstore.reduce((acc, item) => {
                if (!acc[item.Segment]) {
                    acc[item.Segment] = 0;
                }
                acc[item.Segment] += parseFloat(item.Quantity);
                return acc;
            }, {});

            const segment = Object.keys(segmentQuantity);
            const quantity = Object.values(segmentQuantity);
            const pieColors = ["#7C6230", "#B69352", "#D6C096"];
            const segmentctx = document.getElementById("segment").getContext("2d");
            
            new Chart(segmentctx, {
                type: "pie",
                data: {
                    labels: segment,
                    datasets: [{
                        backgroundColor: pieColors,
                        data: quantity
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Segment by Quantity"
                    }
                }
            });

            // Segment by Unique Customer_ID
            const segmentCustomerUnique = superstore.reduce((acc, item) => {
                if (!acc[item.Segment]) {
                    acc[item.Segment] = new Set();
                }
                acc[item.Segment].add(item.Customer_ID);
                return acc;
            }, {});

            const segmentCustomerUniqueFinal = Object.keys(segmentCustomerUnique).reduce((acc, key) => {
                acc[key] = segmentCustomerUnique[key].size;
                return acc;
            }, {});

            const segment2 = Object.keys(segmentCustomerUniqueFinal);
            const customerId = Object.values(segmentCustomerUniqueFinal);
            const pieColors2 = ["#7C6230", "#B69352", "#D6C096"];
            const segment2ctx = document.getElementById("consumer").getContext("2d");
            
            new Chart(segment2ctx, {
                type: "pie",
                data: {
                    labels: segment2,
                    datasets: [{
                        backgroundColor: pieColors2,
                        data: customerId
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Unique Customers by Segment"
                    }
                }
            });

            // Profitable Product
            function calculateTotalProfits(data) {
                const productData = {};

                data.forEach(product => {
                    const productName = product.Sub_Category;
                    const profit = parseFloat(product.Profit);
                    const quantity = parseFloat(product.Quantity);

                    if (productData[productName]) {
                        productData[productName].profit += profit;
                        productData[productName].quantity += quantity;
                    } else {
                        productData[productName] = { profit: profit, quantity: quantity };
                    }
                });

                return productData;
            }

            // Table 1
            const productTableBody1 = document.getElementById('productTable').querySelector('tbody');
            const totalProfits1 = calculateTotalProfits(superstore);
            const sortedProfits1 = Object.entries(totalProfits1).sort((a, b) => b[1].profit - a[1].profit);

            sortedProfits1.forEach(([productName, { profit, quantity }]) => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = productName;

                const profitableCell = document.createElement('td');
                profitableCell.textContent = `$${(profit / quantity).toFixed(2)}`;
                profitableCell.style.textAlign = 'right';

                const profitCell = document.createElement('td');
                profitCell.textContent = `$${profit.toFixed(0)}`;
                profitCell.style.textAlign = 'right';

                row.appendChild(nameCell);
                row.appendChild(profitableCell);
                row.appendChild(profitCell);

                productTableBody1.appendChild(row);
            });

            // Table 2
            const productTableBody2 = document.getElementById('productTable2').querySelector('tbody');
            const totalProfits2 = calculateTotalProfits(superstore);
            const sortedProfits2 = Object.entries(totalProfits2).sort((a, b) => b[1].profit - a[1].profit);

            sortedProfits2.forEach(([productName, { profit, quantity }]) => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = productName;

                const profitableCell = document.createElement('td');
                profitableCell.textContent = `$${(profit / quantity).toFixed(2)}`;
                profitableCell.style.textAlign = 'right';

                const profitCell = document.createElement('td');
                profitCell.textContent = `$${profit.toFixed(0)}`;
                profitCell.style.textAlign = 'right';

                row.appendChild(nameCell);
                row.appendChild(profitableCell);
                row.appendChild(profitCell);

                productTableBody2.appendChild(row);
            });


            // Line Chart for Sales Trend
            const groupedData = superstore.reduce((acc, item) => {
                const orderDate = new Date(item.Order_Date);
                const monthYear = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;

                if (!acc[monthYear]) {
                    acc[monthYear] = 0;
                }
                acc[monthYear] += parseFloat(item.Quantity);

                return acc;
            }, {});

            const sortedData = Object.entries(groupedData).sort(([a], [b]) => {
                const [aYear, aMonth] = a.split('-');
                const [bYear, bMonth] = b.split('-');
                return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
            });

            const orderDate = sortedData.map(([date]) => date);
            const quantity2 = sortedData.map(([, quantity]) => quantity);

            new Chart("lineChart", {
                type: "line",
                data: {
                    labels: orderDate,
                    datasets: [{
                        label: "Quantity",
                        data: quantity2,
                        fill: false,
                        borderColor: "#7C6230",
                        lineTension: 0,
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Quantity by Month and Year"
                    }
                }
            });

            // Mengulangi Grafik 1 (Segment by Quantity)
            const segmentctx2 = document.getElementById("segment2").getContext("2d");
            new Chart(segmentctx2, {
                type: "pie",
                data: {
                    labels: segment,
                    datasets: [{
                        backgroundColor: pieColors,
                        data: quantity
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Segment by Quantity (Duplicate)"
                    }
                }
            });

            // Mengulangi Grafik 2 (Unique Customers by Segment)
            const segment2ctx2 = document.getElementById("consumer2").getContext("2d");
            new Chart(segment2ctx2, {
                type: "pie",
                data: {
                    labels: segment2,
                    datasets: [{
                        backgroundColor: pieColors2,
                        data: customerId
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Unique Customers by Segment (Duplicate)"
                    }
                }
            });

            // Repetition Trend Line 2
            // Line Chart for Sales Trend
            
            new Chart("lineChart2", {
                type: "line",
                data: {
                    labels: orderDate,
                    datasets: [{
                        label: "Quantity",
                        data: quantity2,
                        fill: false,
                        borderColor: "#7C6230",
                        lineTension: 0,
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Quantity by Month and Year"
                    }
                }
            });

            // Initialize DataTable with loaded data
            $("#tableHead").show();
            $("#data-tables").DataTable({
                data: superstore,
                columns: [
                    { data: "Order_ID" },
                    { data: "Order_Date" },
                    { data: "Customer_ID" },
                    { data: "Segment" },
                    { data: "State" },
                    { data: "Sub_Category" },
                    {
                        data: "Sales",
                        render: function(data, type, row) {
                            return '$' + data;
                        },
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).css('text-align', 'right');
                        }
                    },
                    {
                        data: "Quantity",
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).css('text-align', 'center');
                        }
                    },
                    {
                        data: "Profit",
                        render: function(data, type, row) {
                            return '$' + data;
                        },
                        createdCell: function(td, cellData, rowData, row, col) {
                            $(td).css('text-align', 'right');
                        }
                    }
                ]
            });
        })
        .catch(error => {
            console.error('Error fetching superstore data:', error);
        });
});

$('a').on('click', function(event) {
    event.preventDefault();
});


