import React from "react";
import axios from "axios";
import isologo from '../assets/isologo.png'
import { useState, useEffect } from "react";

const NavBar = () => {
    const id_user = sessionStorage.getItem("id");
    const [userRole, setUserRole] = useState(null); // Store user role here

    useEffect(() => {
        axios.get(`http://localhost:3001/api/users/id/${id_user}`)
            .then((response) => {
                const storedUser = response.data;
                if (storedUser) {
                    setUserRole(storedUser.id_role_1);
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    window.location.href = "/login";
                } else {
                    console.error("An error occurred while fetching user data:", error);
                }
            });
    }, [id_user]);
    const signout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    }
    return(
        <div className="navbar">
            <a href="/home" className="barLogo">
                <img src={isologo} width="100" height="40" alt="Logo" />
            </a>
            <div className="navLinks">
                {userRole === 1 ? (
                    <>
                        <a href="/home">Inicio</a>
                        <a href="/admin">Admin</a>
                        <a href="/owner">Dueño</a>
                    </>
                ) : userRole === 2 ? (
                    <>
                        <a href="/home">Inicio</a>
                        <a href="/admin">Admin</a>
                    </>
                ) : userRole === 3 ? (
                    <>
                        <a href="/home">Inicio</a>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <button onClick={signout} className="outButton">Cerrar Sesion</button>
        </div>
    );
};

export default NavBar;