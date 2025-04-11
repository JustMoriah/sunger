// Importaciones necesarias desde React y Chart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Componente de gráfico de líneas
import axios from 'axios'; // Librería para hacer peticiones HTTP
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registro de los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Componente principal para mostrar niveles de corriente
const CurrentLevels = () => {
  // Estados para guardar datos de la API y las etiquetas de tiempo
  const [data, setData] = useState([]); // No se usa directamente, pero lo dejamos porque podría ser útil en el futuro
  const [timeLabels, setTimeLabels] = useState([]); // Etiquetas del eje X (hora)
  const [corrienteData, setCorrienteData] = useState([]); // Valores de corriente del eje Y

  // Hook que se ejecuta una vez al montar el componente
  useEffect(() => {
    // Función para obtener datos desde la API
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api1.sunger.xdn.com.mx/api/get/voltaje');
        const results = response.data; // Datos obtenidos de la API

        // Extraer las etiquetas de tiempo (hora) y valores de corriente
        const labels = results.map(item => item.hora);
        const corriente = results.map(item => parseFloat(item.corriente)); // Convertir a número

        // Alerta si algún valor de corriente excede 200 mA
        corriente.forEach((value) => {
          if (value >= 200) {
            alert(`¡Corriente de ${value} mA excede el valor esperado!`);
          }
        });

        // Actualizar los estados con los datos procesados
        setTimeLabels(labels);
        setCorrienteData(corriente);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Llamar a la función de forma inmediata
    fetchData();

    // Establecer un intervalo para actualizar los datos cada 4 segundos
    const interval = setInterval(fetchData, 4000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // Estructura de los datos para el gráfico
  const chartData = {
    labels: timeLabels, // Etiquetas de tiempo (eje X)
    datasets: [
      {
        label: 'Corriente (mA)',
        data: corrienteData, // Valores de corriente (eje Y)
        fill: false, // No llenar el área bajo la línea
        borderColor: 'rgb(75, 192, 192)', // Color de la línea
        tension: 0.1, // Curvatura suave
      },
    ],
  };

  // Configuraciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monitoreo de corriente en tiempo real', // Título del gráfico
      },
    },
  };

  // Renderizado del componente
  return (
    <div>
      <h2>Monitoreo de corriente</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Exportación del componente
export default CurrentLevels;
