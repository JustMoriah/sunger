import { useState } from "react";
import axios from "axios";

const LogIn = () => {
    const [user, setUser] = useState({
        email: "",
        passwd: "",
        nme: "",
        surnme: "",
        brthdte: "",
        id_role_1: "3"
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https//localhost:3001/api/registros/", user)
            .then(() => alert("Usuario registrado"))
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Correo Electronico" onChange={handleChange} required/>
            <input type="password" name="passwd" placeholder="Contraseña" onChange={handleChange} required/><br/>
            <input type="text" name="nme" placeholder="Nombre" onChange={handleChange} required/><br/>
            <input type="text" name="surnme" placeholder="Apellido(s)" onChange={handleChange} required/><br/>
            <input type="date" name="brthdte" onChange={handleChange} required/><br/>
            <a href="/"><button type="submit">Agregar Usuario</button></a>
        </form>
    );
};

export default UserForm;