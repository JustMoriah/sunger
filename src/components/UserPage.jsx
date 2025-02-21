import React from 'react';
import isologo from '../assets/isologo.png'
import axios from 'axios';
import NavBar from './NavBar';

export default function UserPage() {
  const id_user = sessionStorage.getItem("id");
  axios.get(`http://localhost:3001/api/users/id/${id_user}`)
    .then((response) => {
        const storedUser = response.data;
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = "/login";
    } else {
        console.error("An error occurred while checking for the email:", error);
    }
    });
  return (
    <div>
      <NavBar/><br/><br/>
      <img src={isologo}/>
      <p>Sunger es una empresa comprometida a dar soluciones ecologicas de calidad.</p>
      <p>Nuestro producto representativo es el cargador solar que tiene nuestro mismo nombre.</p>
    </div>
  )
}
