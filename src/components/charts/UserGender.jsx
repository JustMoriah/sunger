// Importa React y los hooks necesarios
import React, { useEffect, useState } from 'react';

// Importa axios para hacer peticiones HTTP
import axios from 'axios';

// Importa el componente Pie desde react-chartjs-2 para mostrar un gráfico circular
import { Pie } from 'react-chartjs-2';

// Importa los componentes de Chart.js necesarios para construir el gráfico
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Importa el plugin para mostrar etiquetas dentro del gráfico (porcentaje)
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registra todos los componentes y plugins necesarios en Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

// Componente funcional que muestra la distribución de género de los usuarios
const UserGender = () => {
  // Estado local para los datos del gráfico
  const [chartData, setChartData] = useState({
    labels: ['Femenino', 'Masculino', 'No Binario', 'Prefiero no decir'],
    datasets: [
      {
        label: 'Género',
        data: [0, 0, 0, 0], // Inicialmente todos los valores son cero
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colores para cada género
      },
    ],
  });

  // Hook useEffect que se ejecuta una sola vez al montar el componente
  useEffect(() => {
    // Realiza una petición GET para obtener la lista de usuarios
    axios.get('https://api1.sunger.xdn.com.mx/api/users/')
      .then(response => {
        const users = response.data;

        // Objeto para contar los géneros
        const genderCount = {
          Femenino: 0,
          Masculino: 0,
          'No Binario': 0,
          '-': 0, // Representa 'Prefiero no decir'
        };

        // Recorre la lista de usuarios y cuenta los géneros
        users.forEach(user => {
          if (user.genero === 'Femenino') genderCount.Femenino++;
          else if (user.genero === 'Masculino') genderCount.Masculino++;
          else if (user.genero === 'No Binario') genderCount['No Binario']++;
          else if (user.genero === '-') genderCount['-']++;
        });

        // Actualiza el estado del gráfico con los nuevos datos
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
      .catch(error => console.error('Error fetching users:', error)); // Manejo de errores
  }, []); // El arreglo vacío indica que esto se ejecuta solo al montar el componente

  // Configuración de opciones para el gráfico
  const options = {
    responsive: true, // El gráfico se adapta al tamaño del contenedor
    plugins: {
      datalabels: {
        color: '#fff', // Color blanco para las etiquetas dentro del gráfico
        formatter: (value, ctx) => {
          // Calcula el porcentaje que representa cada valor
          const total = ctx.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage; // Muestra el porcentaje en el gráfico
        },
        font: {
          weight: 'bold',
          size: 14, // Tamaño de la fuente
        },
      },
      tooltip: {
        // Configura el contenido del tooltip que aparece al pasar el mouse
        callbacks: {
          label: function (tooltipItem) {
            // Muestra el nombre del género y la cantidad exacta de usuarios
            const value = tooltipItem.raw;
            return tooltipItem.label + ': ' + value;
          },
        },
      },
    },
  };

  // Renderiza el componente con el gráfico de pastel
  return (
    <div>
      <h3>Distribución de Género</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes del proyecto
export default UserGender;
