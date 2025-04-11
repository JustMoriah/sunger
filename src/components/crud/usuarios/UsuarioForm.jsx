import { useState } from "react";
import axios from "axios";

const UsuarioForm = () => {
    // Estado inicial para el formulario de usuario
    const [user, setUser] = useState({
        id_rol: "3", // Por defecto, el rol es "Usuario"
        nombre: "",
        apellido: "",
        fn: "",
        genero: "",
        correo: "",
        contrasena: "",
        activo: ""
    });

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evitar el comportamiento por defecto de la página
        // Realizar la solicitud POST para registrar el nuevo usuario
        axios.post("https://api1.sunger.xdn.com.mx/api/users/", user)
            .then(() => {
                alert("Usuario registrado exitosamente");
                // Redirigir a la página de administración de usuarios
                window.location.href = "https://web.sunger.xdn.com.mx/user-manage";
            })
            .catch(error => console.error(error)); // Manejo de errores
    };

    // Verificar si el usuario logueado tiene el rol adecuado para acceder a la página
    const id_usuario = sessionStorage.getItem("id"); // Obtener el ID del usuario logueado
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                // Si el usuario no tiene rol de "Dueño" (rol id_rol != 1), redirigir a la página de inicio
                if (storedUser.id_rol != 1) {
                    window.location.href = "https://web.sunger.xdn.com.mx/home";
                }
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                // Si el usuario no está encontrado, redirigir al login
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                console.error("Ocurrió un error al verificar el usuario:", error);
            }
        });

    return (
        <div>
            <h1>Registro de Usuarios</h1>
            <form onSubmit={handleSubmit}>
                {/* Selector para el rol del usuario */}
                <label>Rol: </label>
                <select name="id_rol" value="3" onChange={handleChange} required>
                    <option value="1">Admin</option>
                    <option value="2">Tecnico</option>
                    <option value="3">Usuario</option>
                </select><br/>

                {/* Campo para el nombre del usuario */}
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required/><br/><br/>

                {/* Campo para el apellido del usuario */}
                <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required/><br/><br/>

                {/* Campo para la fecha de nacimiento */}
                <input type="date" name="fn" onChange={handleChange} required/><br/><br/>

                {/* Selector para el género del usuario */}
                <select name="genero" value={user.genero} onChange={handleChange} required>
                    <option value="">--Selecciona un género--</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No Binario">No Binario</option>
                    <option value="-">Prefiero no decir</option>
                </select><br/><br/>

                {/* Campo para el correo electrónico del usuario */}
                <input type="email" name="correo" placeholder="Correo Electrónico" onChange={handleChange} required/><br/><br/>

                {/* Campo para la contraseña */}
                <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/><br/><br/>

                {/* Selector para el estado de actividad del usuario */}
                <select name="activo" onChange={handleChange} required>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select><br/><br/>

                {/* Botón para enviar el formulario */}
                <button type="submit">Agregar Usuario</button>
            </form><br/><br/>

            {/* Botón para cancelar y regresar a la página de administración de usuarios */}
            <a href="https://web.sunger.xdn.com.mx/user-manage"><button>Cancelar</button></a>
        </div>
    );
};

export default UsuarioForm;
