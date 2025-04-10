import React from 'react';
import axios from 'axios';
import MaintenanceList from '../crud/mantenimientos/MaintenanceList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NavBar from '../NavBar';
import MaintenanceType from '../charts/MaintenanceType';
import MaintenanceExcel from '../excel_manage/MaintenanceExcel';
import CurrentLevels from '../charts/CurrentLevels';
import VoltageLevels from '../charts/VoltageLevels';

export default function MaintenanceManage() {
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
        <h1>Pagina de Mantenimiento</h1>
        <Tabs>
            <TabList>
                <Tab>Table</Tab>
                <Tab>Graphs</Tab>
                <Tab>Niveles de energia</Tab>
            </TabList>
            <TabPanel>
                <MaintenanceList/>
            </TabPanel>
            <TabPanel>
                <MaintenanceType/>
            </TabPanel>
            <TabPanel>
                <CurrentLevels/>
                <VoltageLevels/>
            </TabPanel>
        </Tabs>
        <MaintenanceExcel/>
    </div>
  );
}