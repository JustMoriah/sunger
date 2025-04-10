import React from 'react';
import axios from 'axios';
import UsuarioList from '../crud/usuarios/UsuarioList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NavBar from '../NavBar';
import UserGender from '../charts/UserGender';
import UploadExcel from '../UploadExcel';

export default function UserManage() {
  const id_usuario = sessionStorage.getItem("id");
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      const storedUser = response.data;
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
        <h1>Manejo de Usuarios</h1>
        <Tabs>
          <TabList>
            <Tab>Tabla</Tab>
            <Tab>Graficas</Tab>
          </TabList>
          <div className="tab-container">
            <div className="tab-panel-container">
              <TabPanel className="TabPanel">
                <UsuarioList />
              </TabPanel>
              <TabPanel className="TabPanel">
                <UserGender />
              </TabPanel>
            </div>
          </div>
        </Tabs>
        <UploadExcel/>
    </div>
  );
}