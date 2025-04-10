// MaintenanceType.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';  // Use Line chart from chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

// Register necessary components with Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const MaintenanceType = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api1.sunger.xdn.com.mx/api/maintenance/")
      .then(response => {
        const formattedMaintenance = response.data.map(maintenance => {
          const formattedDate = new Date(maintenance.fecha).toISOString().split('T')[0];
          return { ...maintenance, fecha: formattedDate };
        });
        setMaintenance(formattedMaintenance);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Grouping the data by date and counting the types
  const groupedData = maintenance.reduce((acc, { fecha, tipo }) => {
    if (!acc[fecha]) {
      acc[fecha] = { Reparativo: 0, Rutino: 0 };
    }
    if (tipo === 'Reparativo') {
      acc[fecha].Reparativo++;
    } else if (tipo === 'Rutino') {
      acc[fecha].Rutino++;
    }
    return acc;
  }, {});

  // Extract the dates and the counts for each maintenance type
  const labels = Object.keys(groupedData);
  const reparativoData = labels.map(label => groupedData[label].Reparativo);
  const rutinoData = labels.map(label => groupedData[label].Rutino);

  // Prepare chart data
  const data = {
    labels, // Dates
    datasets: [
      {
        label: 'Reparativo',
        data: reparativoData,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true, // Fill the area under the line
        tension: 0.4, // Smooth the line
      },
      {
        label: 'Rutino',
        data: rutinoData,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true, // Fill the area under the line
        tension: 0.4, // Smooth the line
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Comparación de Tipos de Mantenimiento por Día',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Mantenimientos',
        },
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default MaintenanceType;
