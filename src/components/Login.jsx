import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        passwd: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:3001/api/users/${user.email}`)
            .then((response) => {
                const storedUser = response.data;
                if (storedUser) {
                    if (storedUser.passwd === user.passwd) {
                        if (storedUser.id_role_1 === 1) {
                            window.location.href = "/owner";
                        } else if (storedUser.id_role_1 === 2) {
                            window.location.href = "/admin";
                        } else if (storedUser.id_role_1 === 3) {
                            window.location.href = "/home";
                        }
                    } else {
                        alert("Contraseña incorrecta.");
                    }
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    alert("Usuario no encontrado, por favor registrate.");
                    window.location.href = "/signup";
                } else {
                    console.error("An error occurred while checking for the email:", error);
                }
            });
    };
    

    return (
        <div>
            <div class="login">
                <h1>Iniciar Sesion</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Correo Electronico" onChange={handleChange} required/><br/><br/>
                    <input type="password" name="passwd" placeholder="Contraseña" onChange={handleChange} required/><br/><br/>
                    <button type="submit">Iniciar Sesion</button>
                </form><br/>
            </div>
            <p>¿No tienes cuenta? <a href="/signup">Registrate</a>.</p>
        </div>
    );
};

export default Login;