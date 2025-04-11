// ChargerState.js

// Importaciones necesarias desde React, Chart.js y Axios
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Componente de gráfico de barras
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import axios from 'axios';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Componente principal para mostrar el estado de los cargadores
const ChargerState = () => {
  // Estado para almacenar los datos de cargadores y controlar el estado de carga
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true); // Indica si los datos están siendo cargados

  // Hook que se ejecuta una vez al montar el componente
  useEffect(() => {
    // Petición a la API para obtener todos los cargadores
    axios.get('https://api1.sunger.xdn.com.mx/api/chargers/')
      .then(response => {
        console.log('API response:', response.data); // Log para depuración
        setChargers(response.data); // Guardar los datos obtenidos en el estado
        setLoading(false); // Marcar como finalizada la carga
      })
      .catch(error => {
        console.error("Error fetching chargers data:", error); // Log de error si falla la petición
        setLoading(false); // Aun en error, detener el estado de carga
      });
  }, []);

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div>Loading...</div>;
  }

  // Contar la cantidad de cargadores activos e inactivos
  const stateCounts = chargers.reduce((acc, charger) => {
    if (charger.estado === 1) {
      acc.active = acc.active ? acc.active + 1 : 1; // Sumar al contador de activos
    } else if (charger.estado === 0) {
      acc.inactive = acc.inactive ? acc.inactive + 1 : 1; // Sumar al contador de inactivos
    }
    return acc;
  }, { active: 0, inactive: 0 }); // Estado inicial de contadores

  console.log('State Counts:', stateCounts); // Log para confirmar los resultados

  // Preparar los datos para el gráfico de barras
  const data = {
    labels: ['Activo', 'Inactivo'], // Etiquetas para el eje X
    datasets: [
      {
        label: 'Cantidad de Cargadores por Estado',
        data: [stateCounts.active, stateCounts.inactive], // Datos del eje Y
        backgroundColor: ['#36A2EB', '#FF6384'], // Colores de cada barra
      },
    ],
  };

  // Opciones de configuración del gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Cargadores por Estado', // Título del gráfico
      },
    },
  };

  // Render del componente con el gráfico
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

// Exportar el componente para ser usado en otros archivos
export default ChargerState;
