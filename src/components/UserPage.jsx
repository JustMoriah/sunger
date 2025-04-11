// Importamos React para poder crear el componente
import React from 'react'; 
// Importamos el logo (Isologo) y otros recursos como la imagen del producto
import isologo from '../assets/isologo.png'; 
import productoImage from '../assets/panel.jpeg'; 
// Importamos axios para hacer peticiones HTTP y el componente NavBar
import axios from 'axios'; 
import NavBar from './NavBar'; 
// Importamos el hook useNavigate de react-router-dom para realizar navegación programática
import { useNavigate } from "react-router-dom";

// Componente funcional UserPage
export default function UserPage() {
  // Utilizamos el hook useNavigate para poder redirigir a otras rutas
  const navigate = useNavigate();
  // Obtenemos el ID del usuario desde el sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // Realizamos una solicitud HTTP para obtener la información del usuario con axios
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      // Almacenamos la respuesta (datos del usuario)
      const storedUser = response.data;
    })
    .catch((error) => {
      // Si la respuesta es un error 404, redirigimos al login
      if (error.response && error.response.status === 404) {
        navigate("/login");
      } else {
        console.error("An error occurred while checking for the email:", error);
      }
    });

  return (
    <div>
      {/* Componente NavBar que se muestra al inicio */}
      <NavBar /><br /><br /><br />
      
      {/* Sección del logo */}
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
          {/* Mostramos el isologo con una imagen */}
          <img src={isologo} alt="Isologo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
          {/* Mensaje debajo del logo */}
          <h3><i>Innovación sustentable para un futuro energético eficiente.</i></h3>
        </div>
      </div>

      {/* Contenedor de tarjetas con información */}
      <div className="container card-container">
        {/* Primera tarjeta: Información sobre la organización */}
        <div className="card">
          <h4>Sobre nosotros</h4>
          <p>La organización "Sunger" fue fundada en el año 2025 con el propósito de desarrollar soluciones tecnológicas sustentables...</p>
          {/* Enlace que llevará al usuario a la sección "sobre-nosotros" */}
          <a href="#sobre-nosotros">
            <button>Leer más</button>
          </a>
        </div>
        
        {/* Segunda tarjeta: Información sobre el producto */}
        <div className="card">
          <h4>Producto</h4>
          <p>Los requerimientos técnicos incluyen un Jack USB, paneles solares de 6V, diodos rectificadores y más...</p>
          {/* Enlace que llevará al usuario a la sección "producto" */}
          <a href="#producto">
            <button>Leer más</button>
          </a>
        </div>
        
        {/* Tercera tarjeta: Información sobre la ubicación */}
        <div className="card">
          <h4>Ubicación</h4>
          {/* Mapa incrustado de Google Maps mostrando la ubicación */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15090.418268427822!2d-99.47541!3d19.34026!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428a9d7b5bcd4b5%3A0x548f65d8b9ea5b34!2sUniversidad+Tecnol%C3%B3gica+del+Valle+de+Toluca!5e0!3m2!1ses!2smx!4v1618374985935!5m2!1ses!2smx"
            width="200"
            height="200"
            allowFullScreen=""
            loading="lazy"
            title="Ubicación"
          ></iframe>
          {/* Enlace que llevará al usuario a la sección "ubicacion" */}
          <a href="#ubicacion">
            <button>Leer más</button>
          </a>
        </div>
      </div>

      {/* Secciones con fondo de color */}
      <div id="sobre-nosotros" className="section-bg">
        <h4>Sobre nosotros</h4>
        <p>La organización "Sunger" fue fundada en el año 2025 con el propósito de desarrollar soluciones tecnológicas sustentables...</p>
      </div>

      <div id="producto" className="section-bg">
        <h4>Producto</h4>
        <p>Los requerimientos técnicos incluyen un Jack USB, paneles solares de 6V, diodos rectificadores y más...</p>
        {/* Imagen del producto */}
        <img src={productoImage} alt="Producto" />
      </div>

      <div id="ubicacion" className="section-bg">
        <h4>Ubicación</h4>
        <p>Nos ubicamos en la Universidad Tecnológica del Valle de Toluca.</p>
        {/* Mapa incrustado de Google Maps mostrando la ubicación de los cargadores */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15090.418268427822!2d-99.47541!3d19.34026!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428a9d7b5bcd4b5%3A0x548f65d8b9ea5b34!2sUniversidad+Tecnol%C3%B3gica+del+Valle+de+Toluca!5e0!3m2!1ses!2smx!4v1618374985935!5m2!1ses!2smx"
          width="800"
          height="400"
          allowFullScreen=""
          loading="lazy"
          title="Ubicación"
        ></iframe>
      </div>
    </div>
  );
}
