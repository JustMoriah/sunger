import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import chartjs-plugin-datalabels

// Register the necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, ChartDataLabels); // Register the plugin

const UserGender = () => {
  const [chartData, setChartData] = useState({
    labels: ['Femenino', 'Masculino', 'No Binario', 'Prefiero no decir'],
    datasets: [
      {
        label: 'Género',
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  });

  useEffect(() => {
    // Fetch users data from the API
    axios.get('https://api1.sunger.xdn.com.mx/api/users/')
      .then(response => {
        const users = response.data;

        // Initialize the gender count
        const genderCount = {
          Femenino: 0,
          Masculino: 0,
          'No Binario': 0,
          '-': 0,
        };

        // Calculate the gender distribution
        users.forEach(user => {
          if (user.genero === 'Femenino') genderCount.Femenino++;
          else if (user.genero === 'Masculino') genderCount.Masculino++;
          else if (user.genero === 'No Binario') genderCount['No Binario']++;
          else if (user.genero === '-') genderCount['-']++;
        });

        // Set the chart data
        setChartData(prevData => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [
                genderCount.Femenino,
                genderCount.Masculino,
                genderCount['No Binario'],
                genderCount['-'],
              ],
            },
          ],
        }));
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []); // Empty dependency array to fetch once when the component mounts

  // Configuration for chart options
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#fff', // White text color for datalabels
        formatter: (value, ctx) => {
          const total = ctx.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage; // Display percentage
        },
        font: {
          weight: 'bold',
          size: 14, // Font size for the percentage
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            // Custom tooltip label to display the exact value
            const value = tooltipItem.raw;
            return tooltipItem.label + ': ' + value; // Display the exact number on hover
          },
        },
      },
    },
  };

  return (
    <div>
      <h3>Distribución de Género</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default UserGender;
