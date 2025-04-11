import React, { useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import ChargerList from '../crud/cargador/ChargerList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ChargerState from '../charts/ChargerState';
import ChargerExcel from '../excel_manage/ChargerExcel';
import CurrentLevels from '../charts/CurrentLevels';
import VoltageLevels from '../charts/VoltageLevels';

export default function ChargerManage() {
  // Obtener el ID de usuario desde sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // Verificar el rol del usuario para restringir el acceso a la página
  useEffect(() => {
    if (!id_usuario) {
      // Si no existe el ID de usuario, redirigir al login
      window.location.href = "https://web.sunger.xdn.com.mx/login";
      return;
    }

    // Realizar la solicitud GET para obtener los detalles del usuario
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
      .then((response) => {
        const storedUser = response.data;
        // Verificar si el usuario existe y su rol
        if (storedUser) {
          // Si el rol no es 1 (administrador) ni 2 (mantenimiento), redirigir a la página principal
          if (storedUser.id_rol !== 1 && storedUser.id_rol !== 2) {
            window.location.href = "https://web.sunger.xdn.com.mx/home";
          }
        }
      })
      .catch((error) => {
        // Si la respuesta es 404 (usuario no encontrado), redirigir al login
        if (error.response && error.response.status === 404) {
          window.location.href = "https://web.sunger.xdn.com.mx/login";
        } else {
          console.error("An error occurred while checking for the email:", error);
        }
      });
  }, [id_usuario]);

  return (
    <div>
      {/* Barra de navegación */}
      <NavBar /><br /><br />
      <h1>Manejo de Cargadores</h1>

      {/* Tabs para cambiar entre diferentes vistas */}
      <Tabs>
        <TabList>
          <Tab>Tabla</Tab>
          <Tab>Disponibilidad</Tab>
          <Tab>Niveles de energía</Tab>
        </TabList>

        <div className="tab-container">
          <div className="tab-panel-container">
            {/* Panel de la lista de cargadores */}
            <TabPanel>
              <ChargerList />
            </TabPanel>

            {/* Panel de disponibilidad de los cargadores */}
            <TabPanel>
              <ChargerState />
            </TabPanel>

            {/* Panel con las gráficas de niveles de energía */}
            <TabPanel>
              <CurrentLevels />
              <VoltageLevels />
            </TabPanel>
          </div>
        </div>
      </Tabs>

      {/* Componente para la descarga de datos de cargadores en formato Excel */}
      <ChargerExcel />
    </div>
  );
}
