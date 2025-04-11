// Importa React y los hooks useEffect y useState
import React, { useEffect, useState } from 'react';

// Importa el componente Line de react-chartjs-2 para mostrar gráficos de líneas
import { Line } from 'react-chartjs-2';

// Importa axios para realizar peticiones HTTP
import axios from 'axios';

// Importa y registra los componentes necesarios de Chart.js para crear un gráfico de línea
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

// Registro de los componentes en Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Componente funcional VoltageLevels
const VoltageLevels = () => {
  // Estados locales para almacenar los datos del gráfico
  const [data, setData] = useState([]); // (Nota: 'data' no se usa directamente, pero podrías utilizarlo más adelante)
  const [timeLabels, setTimeLabels] = useState([]); // Etiquetas de tiempo (eje X)
  const [voltajeData, setVoltajeData] = useState([]); // Valores de voltaje (eje Y)

  // Hook useEffect para ejecutar lógica al montar el componente
  useEffect(() => {
    // Función asincrónica para obtener los datos del backend
    const fetchData = async () => {
      try {
        // Realiza la petición GET al endpoint de voltaje
        const response = await axios.get('https://api1.sunger.xdn.com.mx/api/get/voltaje');
        const results = response.data;

        // Extrae las horas como etiquetas y los voltajes como datos numéricos
        const labels = results.map(item => item.hora);
        const voltaje = results.map(item => parseFloat(item.voltaje));

        // Recorre los valores de voltaje para verificar si alguno excede el umbral de 17V
        voltaje.forEach((value) => {
          if (value >= 17) {
            alert(`¡Voltaje de ${value} V excede el valor esperado!`);
          }
        });

        // Actualiza los estados con los nuevos datos
        setTimeLabels(labels);
        setVoltajeData(voltaje);
      } catch (error) {
        // Manejo de errores en consola
        console.error("Error fetching data:", error);
      }
    };

    // Llama a la función al montar el componente
    fetchData();

    // Establece un intervalo para actualizar los datos cada 4 segundos
    const interval = setInterval(fetchData, 4000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Objeto con los datos del gráfico que se pasan al componente Line
  const chartData = {
    labels: timeLabels, // Eje X (horas)
    datasets: [
      {
        label: 'Voltaje (V)', // Nombre de la serie de datos
        data: voltajeData, // Valores del eje Y
        fill: false, // No rellenar debajo de la línea
        borderColor: 'rgb(75, 192, 192)', // Color de la línea
        tension: 0.1, // Suavidad de la curva
      },
    ],
  };

  // Configuración del gráfico (opciones)
  const options = {
    responsive: true, // Gráfico responsivo
    plugins: {
      title: {
        display: true, // Muestra el título
        text: 'Monitoreo de voltaje en tiempo real', // Texto del título
      },
    },
  };

  // Renderiza el componente con el gráfico de línea
  return (
    <div>
      <h2>Monitoreo de voltaje</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes de la app
export default VoltageLevels;
