// MaintenanceType.js

// Importa React y los hooks necesarios
import React, { useEffect, useState } from 'react';

// Importa el componente de gráfico de líneas desde react-chartjs-2
import { Line } from 'react-chartjs-2';

// Importa los módulos requeridos desde Chart.js para el gráfico de líneas
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Importa axios para realizar peticiones HTTP
import axios from 'axios';

// Registra los componentes con Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

// Componente funcional para visualizar los tipos de mantenimiento por día
const MaintenanceType = () => {
  // Estado para guardar los registros de mantenimiento
  const [maintenance, setMaintenance] = useState([]);
  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);

  // Hook useEffect que se ejecuta al montar el componente
  useEffect(() => {
    // Petición GET al endpoint de mantenimientos
    axios.get("https://api1.sunger.xdn.com.mx/api/maintenance/")
      .then(response => {
        // Formatea la fecha para que solo se muestre la parte 'YYYY-MM-DD'
        const formattedMaintenance = response.data.map(maintenance => {
          const formattedDate = new Date(maintenance.fecha).toISOString().split('T')[0];
          return { ...maintenance, fecha: formattedDate };
        });

        // Guarda los datos en el estado y finaliza la carga
        setMaintenance(formattedMaintenance);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false); // Aún si falla, quita el estado de carga
      });
  }, []); // Se ejecuta solo una vez

  // Agrupa los datos por fecha y cuenta cuántos mantenimientos hay por tipo
  const groupedData = maintenance.reduce((acc, { fecha, tipo }) => {
    if (!acc[fecha]) {
      acc[fecha] = { Reparativo: 0, Rutino: 0 }; // Inicializa los contadores por fecha
    }

    // Suma según el tipo
    if (tipo === 'Reparativo') {
      acc[fecha].Reparativo++;
    } else if (tipo === 'Rutino') {
      acc[fecha].Rutino++;
    }

    return acc;
  }, {});

  // Extrae las fechas y los datos de cada tipo de mantenimiento
  const labels = Object.keys(groupedData); // Fechas como etiquetas del eje X
  const reparativoData = labels.map(label => groupedData[label].Reparativo); // Datos para "Reparativo"
  const rutinoData = labels.map(label => groupedData[label].Rutino); // Datos para "Rutino"

  // Datos para el gráfico de líneas
  const data = {
    labels, // Fechas en el eje X
    datasets: [
      {
        label: 'Reparativo',
        data: reparativoData,
        borderColor: '#FF6384', // Color de la línea
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Relleno debajo de la línea
        fill: true,
        tension: 0.4, // Suaviza la curva
      },
      {
        label: 'Rutino',
        data: rutinoData,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Configuraciones del gráfico
  const options = {
    responsive: true, // Se adapta al tamaño del contenedor
    plugins: {
      title: {
        display: true,
        text: 'Comparación de Tipos de Mantenimiento por Día', // Título del gráfico
      },
      legend: {
        position: 'top', // Ubicación de la leyenda
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha', // Título del eje X
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Mantenimientos', // Título del eje Y
        },
      },
    },
  };

  // Muestra mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div>Loading...</div>;
  }

  // Renderiza el gráfico una vez cargados los datos
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

// Exporta el componente para poder usarlo en otras partes de la app
export default MaintenanceType;
