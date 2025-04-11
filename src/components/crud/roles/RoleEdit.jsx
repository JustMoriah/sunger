// Importación de hooks necesarios desde React y utilidades de React Router y Axios
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Componente principal para editar un rol
const RoleEdit = () => {
    // Obtiene el parámetro `id` de la URL (el ID del rol a editar)
    const { id } = useParams();

    // Estado local para guardar los datos del rol
    const [role, setRole] = useState({
        nombre_rol: "",
        permisos: ""
    });

    // Hook de efecto para obtener los datos del rol cuando el componente se monta
    useEffect(() => {
        axios.get(`https://api1.sunger.xdn.com.mx/api/roles/id/${id}`)
            .then(response => {
                // Rellena el estado con la información del rol recibido desde la API
                setRole({ ...response.data });
            })
            .catch(error => console.error(error)); // Manejo de errores
    }, [id]); // Se vuelve a ejecutar si cambia el ID

    // Manejador para actualizar el estado cuando se modifican los inputs del formulario
    const handleChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    };

    // Manejador del envío del formulario (actualiza el rol en el backend)
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        axios.put(`https://api1.sunger.xdn.com.mx/api/roles/id/${id}`, role)
            .then(() => {
                alert("Rol actualizado"); // Notifica al usuario
                // Redirige al usuario a la página de gestión de roles
                window.location.href = "https://web.sunger.xdn.com.mx/role-manage";
            })
            .catch(error => console.error(error)); // Manejo de errores
    };

    // Validación de acceso: solo el usuario con rol "Dueño" (id_rol === 1) puede editar roles
    const id_usuario = sessionStorage.getItem("id");
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                // Redirige si el usuario no tiene permisos
                if (storedUser.id_rol != 1) {
                    window.location.href = "https://web.sunger.xdn.com.mx/home";
                }
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                // Redirige al login si no encuentra al usuario
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                console.error("An error occurred while checking for the email:", error);
            }
        });

    // Renderizado del formulario de edición
    return (
        <div>
            <h1>Actualizar Rol</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre_rol"
                    placeholder="Nombre del rol"
                    value={role.nombre_rol}
                    onChange={handleChange}
                    required
                /><br/><br/>
                <input
                    type="text"
                    name="permisos"
                    placeholder="Permisos"
                    value={role.permisos}
                    onChange={handleChange}
                /><br/><br/>
                <button type="submit">Actualizar Rol</button>
            </form><br />
            {/* Botón para cancelar y volver a la gestión de roles */}
            <a href="https://web.sunger.xdn.com.mx/role-manage">
                <button>Cancelar</button>
            </a>
        </div>
    );
};

export default RoleEdit; // Exporta el componente para ser usado en otras partes
