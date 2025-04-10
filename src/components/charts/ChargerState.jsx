// ChargerState.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

// Register the necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ChargerState = () => {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch chargers data from the API
    axios.get('https://api1.sunger.xdn.com.mx/api/chargers/')
      .then(response => {
        console.log('API response:', response.data); // Log the API response to check if we have data
        setChargers(response.data); // Store the data
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error("Error fetching chargers data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  // If the data is still loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Count occurrences of each state (1 and 0)
  const stateCounts = chargers.reduce((acc, charger) => {
    if (charger.estado === 1) {
      acc.active = acc.active ? acc.active + 1 : 1;
    } else if (charger.estado === 0) {
      acc.inactive = acc.inactive ? acc.inactive + 1 : 1;
    }
    return acc;
  }, { active: 0, inactive: 0 });

  // Log the counts to verify that the counting works
  console.log('State Counts:', stateCounts);

  // Prepare chart data
  const data = {
    labels: ['Activo', 'Inactivo'], // Labels for the states
    datasets: [
      {
        label: 'Cantidad de Cargadores por Estado',
        data: [stateCounts.active, stateCounts.inactive], // Active vs Inactive counts
        backgroundColor: ['#36A2EB', '#FF6384'], // Blue for active, Red for inactive
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Cargadores por Estado',
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChargerState;
