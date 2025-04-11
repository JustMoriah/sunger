// Importamos las dependencias necesarias
import React, { useState, useEffect } from "react";
import axios from "axios";
import isologo from '../assets/isologo.png'; // Importamos el logo
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos de Bootstrap
import { NavDropdown } from 'react-bootstrap'; // Importamos componentes de Bootstrap
import { DropdownSubmenu } from 'react-bootstrap-submenu'; // Importamos el submenú de dropdown

const NavBar = () => {
    // Obtenemos el ID del usuario almacenado en sessionStorage
    const id_usuario = sessionStorage.getItem("id");
    // Inicializamos el estado para el rol del usuario y para el menú desplegable
    const [userRole, setUserRole] = useState(null);
    const [isNavActive, setIsNavActive] = useState(false); // Para alternar el estado del menú móvil

    // Usamos useEffect para obtener los datos del usuario desde la API cuando el componente se monta
    useEffect(() => {
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
            .then((response) => {
                const storedUser = response.data;
                if (storedUser) {
                    setUserRole(storedUser.id_rol); // Establecemos el rol del usuario
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    window.location.href = "https://web.sunger.xdn.com.mx/login"; // Redirigimos al login si no encontramos el usuario
                } else {
                    console.error("An error occurred while fetching user data:", error); // Mostramos el error si hay uno
                }
            });
    }, [id_usuario]);

    // Función para cerrar sesión y registrar el evento de logout
    const signout = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

        const loginData = {
            id_usuario: id_usuario,
            accion: "Logout",
            hora: formattedDate,
        };

        console.log('Sending logout data:', loginData);

        // Enviamos los datos de logout al servidor
        axios.post("https://api1.sunger.xdn.com.mx/api/logins/", loginData)
            .then(() => {
                console.log("Logout registrado correctamente");
                sessionStorage.clear(); // Limpiamos la sesión al cerrar sesión
                window.location.href = "https://web.sunger.xdn.com.mx/login"; // Redirigimos al login
            })
            .catch(error => {
                console.error("Error al registrar logout:", error); // Mostramos error en caso de fallo
            });
    };

    // Función para alternar el estado del menú móvil
    const toggleNav = () => {
        setIsNavActive(prevState => !prevState);
    };

    return (
        <div className={`navbar ${isNavActive ? 'active' : ''}`}>
            {/* Logo de la barra de navegación */}
            <a href="https://web.sunger.xdn.com.mx/home" className="barLogo">
                <img src={isologo} width="100" height="40" alt="Logo" />
            </a>
            {/* Menú hamburguesa para dispositivos móviles */}
            <div className="hamburger-menu" onClick={toggleNav}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            {/* Enlaces de navegación, se muestran dependiendo del rol del usuario */}
            <div className={`navLinks ${isNavActive ? 'active' : ''}`}>
                {/* Si el rol del usuario es 1 (administrador), mostramos las opciones de administración */}
                {userRole === 1 ? (
                    <>
                        <a href="https://web.sunger.xdn.com.mx/home">Inicio</a>
                        <NavDropdown title="Manejo de..." id="basic-nav-dropdown">
                            {/* Submenú para la gestión de cargadores y mantenimiento */}
                            <DropdownSubmenu className="dropdown-submenu" title="Cargadores">
                                <NavDropdown.Item href="https://web.sunger.xdn.com.mx/charger-manage">Cargadores</NavDropdown.Item>
                                <NavDropdown.Item href="https://web.sunger.xdn.com.mx/maintenance">Mantenimiento</NavDropdown.Item>
                            </DropdownSubmenu>
                            {/* Submenú para la gestión de usuarios y roles */}
                            <DropdownSubmenu className="dropdown-submenu" title="Usuarios">
                                <NavDropdown.Item href="https://web.sunger.xdn.com.mx/user-manage">Usuarios</NavDropdown.Item>
                                <NavDropdown.Item href="https://web.sunger.xdn.com.mx/role-manage">Roles</NavDropdown.Item>
                                <NavDropdown.Item href="https://web.sunger.xdn.com.mx/login-history">Logins</NavDropdown.Item>
                            </DropdownSubmenu>
                        </NavDropdown>
                    </>
                ) : userRole === 2 ? (
                    // Si el rol del usuario es 2, mostramos solo opciones relacionadas con el mantenimiento
                    <>
                        <a href="https://web.sunger.xdn.com.mx/home">Inicio</a>
                        <a href="https://web.sunger.xdn.com.mx/maintenance">Mantenimiento</a>
                    </>
                ) : userRole === 3 ? (
                    // Si el rol del usuario es 3, solo mostramos la opción de inicio
                    <>
                        <a href="https://web.sunger.xdn.com.mx/home">Inicio</a>
                    </>
                ) : (
                    // Si el rol del usuario aún no está cargado, mostramos un mensaje de carga
                    <p>Loading...</p>
                )}
                {/* Botón para cerrar sesión */}
                <button onClick={signout} className="outButton">Cerrar Sesion</button>
            </div>
        </div>
    );
};

export default NavBar;
