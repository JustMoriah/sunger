import React, { useState, useEffect } from 'react';
import axios from "axios";
import UsuarioList from './crud/usuarios/UsuarioList';
import NavBar from './NavBar';

export default function AdminPage() {
  // Obtener el ID del usuario desde el sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // useEffect para comprobar el rol del usuario y redirigir si es necesario
  useEffect(() => {
    // Si no hay ID de usuario en el sessionStorage, redirigir a la página de login
    if (!id_usuario) {
      window.location.href = "https://web.sunger.xdn.com.mx/login";
      return;
    }

    // Realizar la solicitud para obtener la información del usuario
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
      .then((response) => {
        const storedUser = response.data;
        // Si se obtiene el usuario, verificar su rol
        if (storedUser) {
          // Redirigir si el rol no es 1 ni 2 (no es un administrador ni un encargado)
          if (storedUser.id_rol !== 1 && storedUser.id_rol !== 2) {
            window.location.href = "https://web.sunger.xdn.com.mx/home";
          }
        }
      })
      .catch((error) => {
        // Si ocurre un error (usuario no encontrado), redirigir a login
        if (error.response && error.response.status === 404) {
          window.location.href = "https://web.sunger.xdn.com.mx/login";
        } else {
          console.error("An error occurred while checking for the user:", error);
        }
      });
  }, [id_usuario]); // El useEffect se ejecutará cuando el id_usuario cambie

  return (
    <div>
      {/* Barra de navegación */}
      <NavBar /><br /><br />
      {/* Componente que muestra la lista de usuarios */}
      <UsuarioList />
    </div>
  );
}
