import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

// Register the necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const LoginActions = () => {
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedActions, setSelectedActions] = useState({
    Login: true,
    Logout: true,
    Registro: true,
  });

  useEffect(() => {
    axios.get('https://api1.sunger.xdn.com.mx/api/logins/')
      .then(response => {
        setLogins(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching login data:", error);
        setLoading(false);
      });
  }, []);

  // If the data is still loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to filter the data based on date range
  const filterLoginsByDate = (logins) => {
    if (!startDate && !endDate) return logins; // No date filter applied

    return logins.filter((login) => {
      const loginDate = new Date(login.hora);
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

  // Grouping actions by date (ignoring time)
  const groupedData = filterLoginsByDate(logins).reduce((acc, login) => {
    const date = new Date(login.hora); // Create a Date object from the `hora` field
    const formattedDate = date.toLocaleDateString(); // Format the date (you can modify this to your preferred format)

    const action = login.accion;

    if (!acc[formattedDate]) {
      acc[formattedDate] = { Login: 0, Logout: 0, Registro: 0 };
    }

    if (action === 'Login') {
      acc[formattedDate].Login++;
    } else if (action === 'Logout') {
      acc[formattedDate].Logout++;
    } else if (action === 'Registro') {
      acc[formattedDate].Registro++;
    }

    return acc;
  }, {});

  // Extract the labels (dates) and data for each action based on selected checkboxes
  const labels = Object.keys(groupedData);
  const loginData = labels.map(label => groupedData[label].Login);
  const logoutData = labels.map(label => groupedData[label].Logout);
  const registroData = labels.map(label => groupedData[label].Registro);

  // Prepare chart data dynamically based on selected actions
  const data = {
    labels: labels, // Date labels
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
    ].filter(Boolean), // Filter out any null values from the dataset array
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Acciones de Login por Día',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
        type: 'category', // Display the dates on the X-axis
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Acciones',
        },
      },
    },
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedActions((prevSelectedActions) => ({
      ...prevSelectedActions,
      [name]: checked,
    }));
  };

  return (
    <div>
      <h3>Acciones de Login por Día</h3>

      {/* Date filters */}
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

      {/* Action checkboxes */}
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

      <Line data={data} options={options} />
    </div>
  );
};

export default LoginActions;
