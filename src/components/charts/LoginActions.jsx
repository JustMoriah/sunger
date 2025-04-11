// Importación de módulos de React y Chart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Gráfico de líneas
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import axios from 'axios'; // Para llamadas HTTP

// Registro de los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Componente principal
const LoginActions = () => {
  // Estados para los datos y filtros
  const [logins, setLogins] = useState([]); // Lista completa de acciones de login
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [startDate, setStartDate] = useState(''); // Filtro de fecha inicial
  const [endDate, setEndDate] = useState(''); // Filtro de fecha final
  const [selectedActions, setSelectedActions] = useState({
    Login: true,
    Logout: true,
    Registro: true,
  }); // Acciones seleccionadas para mostrar en el gráfico

  // useEffect para cargar los datos al iniciar el componente
  useEffect(() => {
    axios.get('https://api1.sunger.xdn.com.mx/api/logins/')
      .then(response => {
        setLogins(response.data); // Guardar acciones obtenidas
        setLoading(false); // Desactivar indicador de carga
      })
      .catch(error => {
        console.error("Error fetching login data:", error);
        setLoading(false);
      });
  }, []);

  // Mostrar un mensaje mientras se cargan los datos
  if (loading) {
    return <div>Loading...</div>;
  }

  // Función que filtra los logins por fecha según los valores seleccionados
  const filterLoginsByDate = (logins) => {
    if (!startDate && !endDate) return logins;

    return logins.filter((login) => {
      const loginDate = new Date(login.hora); // Fecha del evento

      if (startDate && endDate) {
        return loginDate >= new Date(startDate) && loginDate <= new Date(endDate);
      }
      if (startDate) {
        return loginDate >= new Date(startDate);
      }
      if (endDate) {
        return loginDate <= new Date(endDate);
      }

      return true;
    });
  };

  // Agrupar acciones por fecha (ignorando la hora)
  const groupedData = filterLoginsByDate(logins).reduce((acc, login) => {
    const date = new Date(login.hora);
    const formattedDate = date.toLocaleDateString(); // Formato de fecha legible

    const action = login.accion;

    // Inicializar el objeto del día si aún no existe
    if (!acc[formattedDate]) {
      acc[formattedDate] = { Login: 0, Logout: 0, Registro: 0 };
    }

    // Contar la acción según el tipo
    if (action === 'Login') {
      acc[formattedDate].Login++;
    } else if (action === 'Logout') {
      acc[formattedDate].Logout++;
    } else if (action === 'Registro') {
      acc[formattedDate].Registro++;
    }

    return acc;
  }, {});

  // Extraer fechas y datos según la acción
  const labels = Object.keys(groupedData); // Fechas para el eje X
  const loginData = labels.map(label => groupedData[label].Login);
  const logoutData = labels.map(label => groupedData[label].Logout);
  const registroData = labels.map(label => groupedData[label].Registro);

  // Preparar datasets para el gráfico según acciones seleccionadas
  const data = {
    labels: labels, // Fechas
    datasets: [
      selectedActions.Login && {
        label: 'Login',
        data: loginData,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      selectedActions.Logout && {
        label: 'Logout',
        data: logoutData,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      selectedActions.Registro && {
        label: 'Registro',
        data: registroData,
        borderColor: '#FFCE56',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
      },
    ].filter(Boolean), // Elimina cualquier dataset que sea falso (por checkbox desmarcado)
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Acciones de Login por Día',
      },
      tooltip: {
        mode: 'index',
        intersect: false, // Mejora la experiencia con múltiples datasets
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
        type: 'category', // Tipo de eje X
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Acciones',
        },
      },
    },
  };

  // Manejar cambios en los checkboxes de selección de acciones
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedActions((prevSelectedActions) => ({
      ...prevSelectedActions,
      [name]: checked,
    }));
  };

  // Renderizado del componente
  return (
    <div>
      <h3>Acciones de Login por Día</h3>

      {/* Filtros de fecha */}
      <div>
        <label>Fecha de inicio: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        /><br/>
        <label>Fecha final: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Filtros por tipo de acción */}
      <div>
        <label>
          <input
            type="checkbox"
            name="Login"
            checked={selectedActions.Login}
            onChange={handleCheckboxChange}
          />
          &nbsp;Login
        </label><br/>
        <label>
          <input
            type="checkbox"
            name="Logout"
            checked={selectedActions.Logout}
            onChange={handleCheckboxChange}
          />
          &nbsp;Logout
        </label><br/>
        <label>
          <input
            type="checkbox"
            name="Registro"
            checked={selectedActions.Registro}
            onChange={handleCheckboxChange}
          />
          &nbsp;Registro
        </label>
      </div>

      {/* Gráfico de líneas */}
      <Line data={data} options={options} />
    </div>
  );
};

// Exportar el componente
export default LoginActions;
