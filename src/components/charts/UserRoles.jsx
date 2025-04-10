// UserRoles.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Import Pie chart from chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, RadialLinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin for data labels
import axios from 'axios';

// Register necessary components with Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, RadialLinearScale, ChartDataLabels);

const UserRoles = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users
    axios.get('https://api1.sunger.xdn.com.mx/api/users/')
      .then(response => {
        console.log('Fetched users:', response.data); // Debugging log
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Count the number of users for each role
  const roleCounts = users.reduce((acc, user) => {
    console.log('User data:', user); // Debugging log for each user
    // Ensure we compare id_rol as a number instead of a string
    const role = Number(user.id_rol); // Convert to number
    if (role === 1) {
      acc.Dueño = (acc.Dueño || 0) + 1;
    } else if (role === 2) {
      acc.Admin = (acc.Admin || 0) + 1;
    } else if (role === 3) {
      acc.Usuario = (acc.Usuario || 0) + 1;
    }
    return acc;
  }, {});

  console.log('Role counts:', roleCounts); // Debugging log for role counts

  // Prepare chart data
  const data = {
    labels: ['Dueño', 'Admin', 'Usuario'],
    datasets: [
      {
        data: [roleCounts.Dueño || 0, roleCounts.Admin || 0, roleCounts.Usuario || 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Roles de Usuarios',
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let label = tooltipItem.label || '';
            let value = tooltipItem.raw;
            // Format label with the exact value
            label += ': ' + value + ' usuarios';
            return label;
          },
        },
      },
      datalabels: {
        // Display percentage inside the chart
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`; // Show percentage inside the chart
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'center',
        align: 'center',
      },
    },
  };

  return (
    <div>
      <h3>Distribución de Roles de Usuarios</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default UserRoles;
