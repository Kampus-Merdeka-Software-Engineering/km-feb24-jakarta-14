document.addEventListener('DOMContentLoaded', function() {
    // Load Population data
    fetch('population.json')
        .then(response => response.json())
        .then(data => {
            let totalPopulation = data.reduce((total, item) => {
                let populationNumber = parseInt(item.Population.replace(/,/g, ''), 10);
                return total + populationNumber;
            }, 0);

            document.getElementById('total-population').querySelector('.body-stat').textContent = totalPopulation.toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching population data:', error);
        });

    // Load Superstore data
    fetch('superstore.json')
        .then(response => response.json())
        .then(data => {
            // Calculate Total Users
            const uniqueCustomers = new Set();
            data.forEach(item => {
                uniqueCustomers.add(item.Customer_ID);
            });
            const totalUsers = uniqueCustomers.size;

            // Calculate Sales Quantity
            let salesQuantity = data.reduce((total, item) => total + parseFloat(item.Quantity), 0);

            // Calculate Total Profit
            let totalProfit = data.reduce((total, item) => total + parseFloat(item.Profit), 0);

            // Update in the HTML
            document.getElementById('total-user').querySelector('.body-stat').textContent = totalUsers;
            document.getElementById('total-sales').querySelector('.body-stat').textContent = salesQuantity.toFixed(0);
            document.getElementById('total-profit').querySelector('.body-stat').textContent = totalProfit.toFixed(0);
            
            // Sales Distribution
            const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
            const yValues = [55, 49, 44, 24, 15];
            const barColors = ["red", "green","blue","orange","brown"];

            new Chart("bar-sales-distribution", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                backgroundColor: barColors,
                data: yValues
                }]
            },
            options: {
                legend: {display: false},
                title: {
                display: true,
                text: "World Wine Production 2018"
                }
            }
            });

            // Sales Distribution-2
            const xValues2 = ["Italy", "France", "Spain", "USA", "Argentina"];
            const yValues2 = [55, 49, 44, 24, 15];
            const barColors2 = ["red", "green","blue","orange","brown"];

            new Chart("bar-sales-distribution-2", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                backgroundColor: barColors,
                data: yValues
                }]
            },
            options: {
                legend: {display: false},
                title: {
                display: true,
                text: "World Wine Production 2018"
                }
            }
            });

            // Process data for Pie Chart - Segment by Quantity
            const segmentQuantities = data.reduce((acc, item) => {
                if (!acc[item.Segment]) {
                    acc[item.Segment] = 0;
                }
                acc[item.Segment] += parseFloat(item.Quantity);
                return acc;
            }, {});

            const segment = Object.keys(segmentQuantities);
            const quantity = Object.values(segmentQuantities);
            const pieColors = ["#7C6230", "#B69352", "#D6C096"];

            new Chart("segment", {
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

            // Process data for Pie Chart - Unique Customers by Segment
            const segmentCustomerUnique = data.reduce((acc, item) => {
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

            new Chart("consumer", {
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

            // Calculate Total Profits for each product
            function calculateTotalProfits(data) {
                const productProfits = {};

                data.forEach(product => {
                    const productName = product.Sub_Category;
                    const profit = parseFloat(product.Profit);

                    if (productProfits[productName]) {
                        productProfits[productName] += profit;
                    } else {
                        productProfits[productName] = profit;
                    }
                });

                return productProfits;
            }
            const productTableBody = document.getElementById('productTable').querySelector('tbody');
            const totalProfits = calculateTotalProfits(data);
            const sortedProfits = Object.entries(totalProfits).sort((a, b) => b[1] - a[1]);
            sortedProfits.forEach(([productName, profit]) => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = productName;

                const profitCell = document.createElement('td');
                profitCell.textContent = profit.toFixed(2);

                row.appendChild(nameCell);
                row.appendChild(profitCell);

                productTableBody.appendChild(row);
            });

            // Line Chart for Sales Trend
            const groupedData = data.reduce((acc, item) => {
                const orderDate = new Date(item.Order_Date);
                const monthYear = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1)}`;

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
                        borderColor: "#3e95cd",
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
        })
        .catch(error => {
            console.error('Error fetching superstore data:', error);
        });
});


