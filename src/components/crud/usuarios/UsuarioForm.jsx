import { useState } from "react";
import axios from "axios";

const UsuarioForm = () => {
    const [user, setUser] = useState({
        id_rol: "3",
        nombre: "",
        apellido: "",
        fn: "",
        genero: "",
        correo: "",
        contrasena: "",
        activo: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://api1.sunger.xdn.com.mx/api/users/", user)
            .then(() => {alert("Rol registrado")
                window.location.href = "https://web.sunger.xdn.com.mx/user-manage";
            })
            .catch(error => console.error(error));
    };

    const id_usuario = sessionStorage.getItem("id");
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
        const storedUser = response.data;
        if (storedUser) {
          if (storedUser.id_rol != 1) {
            window.location.href = "https://web.sunger.xdn.com.mx/home";
          }
        }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = "https://web.sunger.xdn.com.mx/login";
    } else {
        console.error("An error occurred while checking for the email:", error);
    }
    });

    return (
        <div>
            <h1>Registro de Usuarios</h1>
            <form onSubmit={handleSubmit}>
                <label>Rol: </label>
                <select name="id_rol" value="3" onChange={handleChange} required>
                    <option value="1">Dueno</option>
                    <option value="2">Admin</option>
                    <option value="3">Usuario</option>
                </select><br/>
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required/><br/><br/>
                <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required/><br/><br/>
                <input type="date" name="fn" onChange={handleChange} required/><br/><br/>
                <select name="genero" value={user.genero} onChange={handleChange} required>
                    <option value="">--Selecciona un genero--</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No Binario">No Binario</option>
                    <option value="-">Prefiero no decir</option>
                </select><br/><br/>
                <input type="email" name="correo" placeholder="Correo Electronico" onChange={handleChange} required/><br/><br/>
                <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/><br/><br/>
                <select name="activo" onChange={handleChange} required>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select><br/><br/>
                <button type="submit">Agregar Usuario</button>
            </form><br/><br/>
            <a href="https://web.sunger.xdn.com.mx/user-manage"><button>Cancelar</button></a>
        </div>
    );
};

export default UsuarioForm;