// UserRoles.js

// Importa React y los hooks useEffect y useState
import React, { useEffect, useState } from 'react';

// Importa el componente Pie (gráfico circular) de react-chartjs-2
import { Pie } from 'react-chartjs-2';

// Importa componentes necesarios desde chart.js para que funcione el gráfico circular
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  RadialLinearScale
} from 'chart.js';

// Importa el plugin para mostrar etiquetas dentro del gráfico
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Importa axios para hacer peticiones HTTP
import axios from 'axios';

// Registra todos los componentes y plugins necesarios en Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  RadialLinearScale,
  ChartDataLabels
);

// Componente funcional que renderiza un gráfico de pastel con la distribución de roles de usuario
const UserRoles = () => {
  // Estado local para guardar los datos de los usuarios
  const [users, setUsers] = useState([]);

  // Hook useEffect que se ejecuta una sola vez al montar el componente
  useEffect(() => {
    // Petición GET para obtener todos los usuarios
    axios.get('https://api1.sunger.xdn.com.mx/api/users/')
      .then(response => {
        console.log('Fetched users:', response.data); // Log de depuración
        setUsers(response.data); // Guarda los usuarios en el estado
      })
      .catch(error => {
        console.error('Error fetching users:', error); // Log en caso de error
      });
  }, []);

  // Cálculo del número de usuarios por rol
  const roleCounts = users.reduce((acc, user) => {
    console.log('User data:', user); // Log individual de cada usuario
    const role = Number(user.id_rol); // Asegura que el rol sea tratado como número

    // Clasifica al usuario según su rol y acumula la cantidad
    if (role === 1) {
      acc.Dueño = (acc.Dueño || 0) + 1;
    } else if (role === 2) {
      acc.Admin = (acc.Admin || 0) + 1;
    } else if (role === 3) {
      acc.Usuario = (acc.Usuario || 0) + 1;
    }
    return acc;
  }, {}); // Objeto inicial vacío

  console.log('Role counts:', roleCounts); // Log de los totales por rol

  // Datos para alimentar el gráfico de pastel
  const data = {
    labels: ['Dueño', 'Admin', 'Usuario'], // Etiquetas de los roles
    datasets: [
      {
        data: [
          roleCounts.Dueño || 0,
          roleCounts.Admin || 0,
          roleCounts.Usuario || 0
        ], // Valores asociados a cada rol
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores del gráfico
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores al pasar el mouse
      },
    ],
  };

  // Configuración del gráfico
  const options = {
    responsive: true, // Hace el gráfico adaptable al tamaño del contenedor
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Roles de Usuarios', // Título del gráfico
      },
      legend: {
        position: 'top', // Posición de la leyenda
      },
      tooltip: {
        // Configura los tooltips (cuadros emergentes al pasar el mouse)
        callbacks: {
          label: function (tooltipItem) {
            let label = tooltipItem.label || '';
            let value = tooltipItem.raw;
            // Devuelve el label con el valor correspondiente
            label += ': ' + value + ' usuarios';
            return label;
          },
        },
      },
      datalabels: {
        // Configuración de etiquetas dentro del gráfico
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`; // Muestra el porcentaje dentro de cada sección
        },
        color: '#fff', // Color del texto
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'center',
        align: 'center',
      },
    },
  };

  // Renderiza el componente
  return (
    <div>
      <h3>Distribución de Roles de Usuarios</h3>
      <Pie data={data} options={options} /> {/* Gráfico de pastel */}
    </div>
  );
};

// Exporta el componente para que se pueda usar en otros archivos
export default UserRoles;
