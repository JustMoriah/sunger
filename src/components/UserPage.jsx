import React from 'react';
import isologo from '../assets/isologo.png';
import axios from 'axios';
import NavBar from './NavBar';
import productoImage from '../assets/panel.jpeg';
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const navigate = useNavigate();
  const id_usuario = sessionStorage.getItem("id");
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      const storedUser = response.data;
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        navigate("/login");
      } else {
        console.error("An error occurred while checking for the email:", error);
      }
    });

  return (
    <div>
      <NavBar /><br /><br /><br />
      
      {/* Logo Section */}
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
        <img src={isologo} alt="Isologo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
          <h3><i>Innovación sustentable para un futuro energético eficiente.</i></h3>
        </div>
      </div>

      {/* Card Container */}
      <div className="container card-container">
        <div className="card">
          <h4>Sobre nosotros</h4>
          <p>La organización "Sunger" fue fundada en el año 2025 con el propósito de desarrollar soluciones tecnológicas sustentables...</p>
          <a href="#sobre-nosotros">
            <button>Leer más</button>
          </a>
        </div>
        
        <div className="card">
          <h4>Producto</h4>
          <p>Los requerimientos técnicos incluyen un Jack USB, paneles solares de 6V, diodos rectificadores y más...</p>
          <a href="#producto">
            <button>Leer más</button>
          </a>
        </div>
        
        <div className="card">
          <h4>Ubicación</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15090.418268427822!2d-99.47541!3d19.34026!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428a9d7b5bcd4b5%3A0x548f65d8b9ea5b34!2sUniversidad+Tecnol%C3%B3gica+del+Valle+de+Toluca!5e0!3m2!1ses!2smx!4v1618374985935!5m2!1ses!2smx"
            width="200"
            height="200"
            allowFullScreen=""
            loading="lazy"
            title="Ubicación"
          ></iframe>
          <a href="#ubicacion">
            <button>Leer más</button>
          </a>
        </div>
      </div>

      {/* Sections with background */}
      <div id="sobre-nosotros" className="section-bg">
        <h4>Sobre nosotros</h4>
        <p>La organización "Sunger" fue fundada en el año 2025 con el propósito de desarrollar soluciones tecnológicas sustentables...</p>
      </div>

      <div id="producto" className="section-bg">
        <h4>Producto</h4>
        <p>Los requerimientos técnicos incluyen un Jack USB, paneles solares de 6V, diodos rectificadores y más...</p>
        <img src={productoImage} alt="Producto" />
      </div>

      <div id="ubicacion" className="section-bg">
        <h4>Ubicación</h4>
        <p>Nos ubicamos en la Universidad Tecnológica del Valle de Toluca.</p>
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