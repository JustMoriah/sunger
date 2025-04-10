import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [login, setLogin] = useState({
        id_usuario: "",
        accion: "",
        hora: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos enviados:", login);

        axios.post("https://api1.sunger.xdn.com.mx/api/logins/", login)
            .then(() => alert("Login registrado correctamente"))
            .catch(error => {
                console.error("Error al registrar login:", error);
                alert("Hubo un error al registrar el login.");
            });
    };

    return (
        <div>
            <h1>Registro de Logins</h1>
            <form onSubmit={handleSubmit}>


                <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre" 
                    value={login.nombre} 
                    onChange={handleChange} 
                    required 
                /><br/><br/>

                <input 
                    type="text" 
                    name="ap_pat" 
                    placeholder="Apellido Paterno" 
                    value={login.ap_pat} 
                    onChange={handleChange} 
                    required 
                /><br/><br/>

                <input 
                    type="text" 
                    name="ap_mat" 
                    placeholder="Apellido Materno" 
                    value={login.ap_mat} 
                    onChange={handleChange} 
                    required 
                /><br/><br/>

                <input 
                    type="email" 
                    name="correo" 
                    placeholder="Correo electrónico" 
                    value={login.correo} 
                    onChange={handleChange} 
                    required 
                /><br/><br/>

                <input 
                    type="password" 
                    name="contrasena" 
                    placeholder="Contraseña" 
                    value={login.contrasena} 
                    onChange={handleChange} 
                    required 
                /><br/><br/>

                <button type="submit">Registrar Login</button>
            </form><br/>
            <a href="https://web.sunger.xdn.com.mx/owner"><button>Cancelar</button></a>
        </div>
    );
};

export default LoginForm;
