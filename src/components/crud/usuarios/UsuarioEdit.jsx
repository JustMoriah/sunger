import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UsuarioEdit = () => {
    const { id } = useParams(); // Obtiene el ID del usuario desde la URL
    const [user, setUser] = useState({
        id_rol: "",
        nombre: "",
        apellido: "",
        fn: "",
        genero: "",
        correo: "",
        contrasena: "",
        activo: ""
    });

    // Al cargar el componente, se obtiene la información del usuario
    useEffect(() => {
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id}`)
            .then(response => {
                // Formatear la fecha de nacimiento (fn) a formato YYYY-MM-DD
                const formattedDate = new Date(response.data.fn).toISOString().split('T')[0];
                setUser({ ...response.data, fn: formattedDate });
            })
            .catch(error => console.error(error));
    }, [id]);

    // Función para manejar cambios en el formulario
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Función para manejar el envío del formulario (actualización del usuario)
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        axios.put(`https://api1.sunger.xdn.com.mx/api/users/id/${id}`, user)
            .then(() => {
                alert("Usuario actualizado");
                // Redirige a la página de administración de usuarios después de la actualización
                window.location.href = "https://web.sunger.xdn.com.mx/user-manage";
            })
            .catch(error => console.error(error));
    };

    // Verificar si el usuario logueado tiene permisos para editar
    const id_usuario = sessionStorage.getItem("id"); // Obtiene el ID del usuario logueado
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                // Si el usuario no tiene rol de "Dueño" (id_rol != 1), redirige a la página de inicio
                if (storedUser.id_rol != 1) {
                    window.location.href = "https://web.sunger.xdn.com.mx/home";
                }
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login"; // Si no se encuentra el usuario logueado, redirige al login
            } else {
                console.error("Ocurrió un error al verificar el usuario:", error);
            }
        });

    return (
        <div>
            <h1>Actualizar Usuario</h1>
            <form onSubmit={handleSubmit}>
                {/* Campo para seleccionar el rol */}
                <label>Rol: </label>
                <select name="id_rol" value={user.id_rol} onChange={handleChange} required>
                    <option value="1">Admin</option>
                    <option value="2">Tecnico</option>
                    <option value="3">Usuario</option>
                </select><br /><br />
                {/* Campo para el nombre */}
                <input type="text" name="nombre" placeholder="Nombre" value={user.nombre} onChange={handleChange} required /><br /><br />
                {/* Campo para el apellido */}
                <input type="text" name="apellido" placeholder="Apellido Paterno" value={user.apellido} onChange={handleChange} required /><br /><br />
                {/* Campo para la fecha de nacimiento */}
                <input type="date" name="fn" value={user.fn} onChange={handleChange} required /><br /><br />
                {/* Campo para seleccionar el género */}
                <select name="genero" value={user.genero} onChange={handleChange}>
                    <option value="">--Selecciona un género--</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No Binario">No Binario</option>
                    <option value="-">Prefiero no decir</option>
                </select><br/><br/>
                {/* Campo para el correo */}
                <input type="email" name="correo" placeholder="Correo Electrónico" value={user.correo} onChange={handleChange} required /><br /><br />
                {/* Campo para la contraseña */}
                <input type="password" name="contrasena" placeholder="Contraseña" value={user.contrasena} onChange={handleChange} required /><br /><br />
                {/* Campo para el estado de actividad */}
                <select name="activo" value={user.activo} onChange={handleChange} required>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select><br/><br/>
                <button type="submit">Actualizar Usuario</button>
            </form><br />
            {/* Botón de cancelar */}
            <a href="https://web.sunger.xdn.com.mx/user-manage"><button>Cancelar</button></a>
        </div>
    );
};

export default UsuarioEdit;
