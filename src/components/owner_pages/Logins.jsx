import React from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import LoginList from '../crud/logins/logineffect';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LoginActions from '../charts/LoginActions';

export default function LoginHistory() {
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
        <h1>Historial de Logins, logouts, y registros</h1>
        <Tabs>
            <TabList>
                <Tab>Tabla</Tab>
                <Tab>Graficas</Tab>
            </TabList>
            <TabPanel>
                <LoginList/>
            </TabPanel>
            <TabPanel>
                <LoginActions/>
            </TabPanel>
        </Tabs>
    </div>
  );
}