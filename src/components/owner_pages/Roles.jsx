import React from 'react';
import axios from 'axios';
import RoleList from '../crud/roles/RoleList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NavBar from '../NavBar';
import UserRoles from '../charts/UserRoles';
import RoleExcel from '../excel_manage/RoleExcel';

export default function RoleManage() {
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
        <h1>Manejo de Roles</h1>
        <Tabs>
            <TabList>
                <Tab>Tabla</Tab>
                <Tab>Graficas</Tab>
            </TabList>
            <TabPanel>
                <RoleList/>
            </TabPanel>
            <TabPanel>
                <UserRoles/>
            </TabPanel>
        </Tabs>
        <RoleExcel/>
    </div>
  );
}