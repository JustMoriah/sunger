import React from 'react';
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
        <h1>Manejo de Cargadores</h1>
        <Tabs>
            <TabList>
                <Tab>Tabla</Tab>
                <Tab>Disponibilidad</Tab>
                <Tab>Niveles de energia</Tab>
            </TabList>
            <TabPanel>
                <ChargerList/>
            </TabPanel>
            <TabPanel>
                <ChargerState/>
            </TabPanel>
            <TabPanel>
                <CurrentLevels/>
                <VoltageLevels/>
            </TabPanel>
        </Tabs>
        <ChargerExcel/>
    </div>
  );
}