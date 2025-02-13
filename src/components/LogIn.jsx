import { useState } from "react";
import axios from "axios";

const LogIn = () => {
    const [user, setUser] = useState({
        email: "",
        passwd: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`https//localhost:3001/api/users/${email}`, user)
            .then(() => alert("Usuario registrado"))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Correo Electronico" onChange={handleChange} required/>
                <input type="password" name="passwd" placeholder="Contraseña" onChange={handleChange} required/><br/>
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>¿No tienes una cuenta? <a href="/signup">Registrate</a>.</p>
        </div>
    );
};

export default LogIn;