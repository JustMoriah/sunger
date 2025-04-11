// Importamos las dependencias necesarias
import React from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import UsuarioList from './crud/usuarios/UsuarioList';
import RoleList from './crud/roles/RoleList';
import ChargerList from './crud/cargador/ChargerList';
import UploadExcel from './UploadExcel';
import LoginList from './crud/logins/logineffect';
import MaintenanceList from './crud/mantenimientos/MaintenanceList';

export default function OwnerPage() {
  // Obtenemos el ID del usuario almacenado en sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // Realizamos una petición GET para obtener la información del usuario con el ID almacenado
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      const storedUser = response.data;
      // Si el usuario tiene un rol diferente a 1 (rol de dueño), redirigimos a la página de inicio
      if (storedUser) {
        if (storedUser.id_rol != 1) {
          window.location.href = "https://web.sunger.xdn.com.mx/home";
        }
      }
    })
    .catch((error) => {
      // Si el error es un 404, redirigimos al login
      if (error.response && error.response.status === 404) {
        window.location.href = "https://web.sunger.xdn.com.mx/login";
      } else {
        console.error("An error occurred while checking for the email:", error); // Si ocurre otro error, lo mostramos en la consola
      }
    });

  return (
    <div>
      {/* Barra de navegación */}
      <NavBar/><br/><br/>
      
      {/* Sección para manejo de usuarios */}
      <h2>Manejo de usuarios</h2>
      <UsuarioList/> {/* Componente para mostrar y gestionar usuarios */}
      <UploadExcel/> {/* Componente para subir archivo Excel */}

      <br/>

      {/* Sección para manejo de roles */}
      <h2>Manejo de Roles</h2>
      <RoleList/> {/* Componente para mostrar y gestionar roles */}

      {/* Sección para manejo de cargadores */}
      <h2>Manejo de Cargadores</h2>
      <ChargerList/> {/* Componente para mostrar y gestionar cargadores */}

      {/* Sección para manejo de logins */}
      <h2>Manejo de Logins</h2>
      <LoginList/> {/* Componente para mostrar y gestionar logins */}

      {/* Sección para manejo de mantenimientos */}
      <h2>Manejo de Mantenimiento</h2>
      <MaintenanceList/> {/* Componente para mostrar y gestionar mantenimientos */}

      <br/>
    </div>
  );
}
