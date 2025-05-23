import React, { useEffect } from 'react';
import axios from 'axios';
import UsuarioList from '../crud/usuarios/UsuarioList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NavBar from '../NavBar';
import UserGender from '../charts/UserGender';
import UploadExcel from '../UploadExcel';

export default function UserManage() {
  // Obtener el ID de usuario desde el sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // Verificar el rol del usuario para restringir acceso a la página
  useEffect(() => {
    // Si no hay un ID de usuario en el sessionStorage, redirigir al login
    if (!id_usuario) {
      window.location.href = "https://web.sunger.xdn.com.mx/login";
      return;
    }

    // Realizar la solicitud para obtener los detalles del usuario
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
      .then((response) => {
        const storedUser = response.data;
        // Verificar si el usuario existe y su rol
        if (storedUser) {
          // Si el rol no es 1 (administrador), redirigir a la página principal
          if (storedUser.id_rol !== 1) {
            window.location.href = "https://web.sunger.xdn.com.mx/home";
          }
        }
      })
      .catch((error) => {
        // Si la respuesta es 404 (usuario no encontrado), redirigir al login
        if (error.response && error.response.status === 404) {
          window.location.href = "https://web.sunger.xdn.com.mx/login";
        } else {
          console.error("An error occurred while checking for the user:", error);
        }
      });
  }, [id_usuario]);

  return (
    <div>
      {/* Barra de navegación */}
      <NavBar /><br /><br />
      <h1>Manejo de Usuarios</h1>
      {/* Tabs para cambiar entre vista de tabla y gráficos */}
      <Tabs>
        <TabList>
          <Tab>Tabla</Tab>
          <Tab>Gráficas</Tab>
        </TabList>
        <div className="tab-container">
          <div className="tab-panel-container">
            {/* Panel de la tabla de usuarios */}
            <TabPanel className="TabPanel">
              <UsuarioList />
            </TabPanel>
            {/* Panel de la gráfica de género de usuarios */}
            <TabPanel className="TabPanel">
              <UserGender />
            </TabPanel>
          </div>
        </div>
      </Tabs>
      {/* Componente para subir archivo Excel */}
      <UploadExcel />
    </div>
  );
}
