import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VoltageLevels = () => {
  const [data, setData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [voltajeData, setVoltajeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api1.sunger.xdn.com.mx/api/get/voltaje');
        const results = response.data;

        const labels = results.map(item => item.hora);
        const voltaje = results.map(item => parseFloat(item.voltaje));

        voltaje.forEach((value) => {
            if (value >= 17) {
              alert(`¡Voltaje de ${value} V excede el valor esperado!`);
            }
        });
        
        setTimeLabels(labels);
        setVoltajeData(voltaje);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Voltaje (V)',
        data: voltajeData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monitoreo de voltaje en tiempo real',
      },
    },
  };

  return (
    <div>
      <h2>Monitoreo de voltaje</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default VoltageLevels;
