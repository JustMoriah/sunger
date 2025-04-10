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
  const id_usuario = sessionStorage.getItem("id");
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      
        const storedUser = response.data;
        if (storedUser) {
          if (storedUser.id_rol != 1) {
            window.location.href = "https://web.sunger.xdn.com.mx/home";
          }
        }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = "https://web.sunger.xdn.com.mx/login";
    } else {
        console.error("An error occurred while checking for the email:", error);
    }
    });
  return (
    <div>
      <NavBar/><br/><br/>
      <h2>Manejo de usuarios</h2>
      <UsuarioList/>
      <UploadExcel/>
      <br/>
      <h2>Manejo de Roles</h2>
      <RoleList/>
      <h2>Manejo de Cargadores</h2>
      <ChargerList/>
      <h2>Manejo de Logins</h2>
      <LoginList/>
      <h2>Manejo de Mantenimiento</h2>
      <MaintenanceList/>
      <br/>
    </div>
  );
}
