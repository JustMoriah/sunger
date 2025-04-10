import { useState } from "react";
import axios from "axios";

const SignUp = () => {
    const [user, setUser] = useState({
        id_rol: 3,
        nombre: "",
        apellido: "",
        fn: "",
        genero: "",
        correo: "",
        contrasena: "",
        activo: 1,
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/correo/${user.correo}`)
            .then((response) => {
                if (response.data) {
                    alert("El correo ingresado ya esta en uso, por favor elige uno diferente o inicia sesion.");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    axios.post("https://api1.sunger.xdn.com.mx/api/users/", user)
                        .then(() => {
                            alert("Usuario registrado");
                            window.location.href = "https://web.sunger.xdn.com.mx/login";
                        })
                        .catch((error) => console.error(error));
                } else {
                    console.error("An error occurred while checking for the user:", error);
                }
            });
    };

    return (
        <div>
            <div class="login">
                <h1>Registrarse</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="correo" placeholder="Correo Electronico" onChange={handleChange} required/><br/><br/>
                    <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/><br/><br/>
                    <input type="text" name="nombre" placeholder="Nombre(s)" onChange={handleChange} required/><br/><br/>
                    <input type="text" name="apellido" placeholder="Apellido(s)" onChange={handleChange} required/><br/><br/>
                    <input type="date" name="fn" onChange={handleChange} required/><br/><br/>
                    <select name="genero" onChange={handleChange} required>
                        <option value="">--Selecciona tu genero--</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="No Binario">No Binario</option>
                        <option value="-">Prefiero no decir</option>
                    </select><br/><br/>
                    <button type="submit">Registrarse</button>
                </form><br/>
            </div>
            <p>¿Ya tienes cuenta? <a href="https://web.sunger.xdn.com.mx/login">Inicia sesion</a>.</p>
        </div>
    );
};

export default SignUp;