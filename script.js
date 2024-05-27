document.addEventListener('DOMContentLoaded', function() {
    
    //Population.json
    fetch('population.json')
    .then(response => response.json())
    .then(data => {
      // Assuming data is an array of objects with a Population property
      let totalPopulation = data.reduce((total, item) => {
        // Remove commas from population string and convert to number
        let populationNumber = parseInt(item.Population.replace(/,/g, ''), 10);
        return total + populationNumber;
      }, 0);

      // Update the total population in the HTML
      document.getElementById('total-population').querySelector('.body-stat').textContent = totalPopulation.toLocaleString();
    })
    .catch(error => {
      console.error('Error fetching population data:', error);
    }); 

    // Superstore.json
    fetch('superstore.json')
    .then(response => response.json())
    .then(data => {

    //Total User
      // Create a set to store unique Customer_IDs
      const uniqueCustomers = new Set();

      // Loop through the data to extract Customer_IDs
      data.forEach(item => {
        uniqueCustomers.add(item.Customer_ID);
      });

      // Get the number of unique customers
      const totalUsers = uniqueCustomers.size;

    //Sales Quantity
      // Calculate Sales Quantity
      let salesQuantity = 0;

      // Loop through the data to sum up the quantity
      data.forEach(item => {
        salesQuantity += parseFloat(item.Quantity);
      });

    //Total Profit
      // Calculate total sales
      let totalProfit = 0;

      // Loop through the data to sum up the sales
      data.forEach(item => {
        totalProfit += parseFloat(item.Profit);
      });

      // Update in the HTML
      document.getElementById('total-user').querySelector('.body-stat').textContent = totalUsers;
      document.getElementById('total-sales').querySelector('.body-stat').textContent = salesQuantity.toFixed(0);
      document.getElementById('total-profit').querySelector('.body-stat').textContent = totalProfit.toFixed(0);
    })
    .catch(error => {
      console.error('Error fetching superstore data:', error);
    });

    // Dummy data
    const data = {
        salesTrend: {
            labels: ["January", "February", "March", "April", "May", "June"],
            data: [15000, 20000, 18000, 22000, 17000, 25000]
        },
        products: [
            { name: "Product 1", profit: 5000 },
            { name: "Product 2", profit: 10000 },
            { name: "Product 3", profit: 7000 }
        ],
        salesDistribution: {
            "US-CA": 120000,
            "US-TX": 90000,
            "US-FL": 60000
        }
    };

    // Pie Chart for Market Segmentation
    const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    const yValues = [55, 49, 44, 24, 15];
    const barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
    ];

    new Chart("segment", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: barColors,
        data: yValues
        }]
    },
    options: {
        title: {
        display: true,
        text: "World Wide Wine Production 2018"
        }
    }
    });

    // Line Chart for Sales Trend
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: data.salesTrend.labels,
            datasets: [{
                label: 'Sales Trend',
                data: data.salesTrend.data,
                borderColor: '#007bff',
                fill: false
            }]
        },
        options: {
            responsive: true
        }
    });

    // Product Table
    const productTableBody = document.getElementById('productTable').querySelector('tbody');
    data.products.forEach(product => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;
        const profitCell = document.createElement('td');
        profitCell.textContent = product.profit;
        row.appendChild(nameCell);
        row.appendChild(profitCell);
        productTableBody.appendChild(row);
    });

    // Map Chart for Sales Distribution
    Highcharts.mapChart('mapChart', {
        chart: {
            map: 'countries/us/us-all'
        },
        title: {
            text: 'Sales Distribution by State'
        },
        series: [{
            data: Object.entries(data.salesDistribution),
            mapData: Highcharts.maps['countries/us/us-all'],
            joinBy: 'hc-key',
            name: 'Sales',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
