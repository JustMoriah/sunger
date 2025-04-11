import { useState } from "react";
import axios from "axios";

// Componente para registrar un nuevo rol
const RoleForm = () => {
    // Estado para almacenar los valores del formulario
    const [role, setRole] = useState({
        nombre_rol: "",  // Nombre del rol
        permisos: ""     // Permisos asociados al rol
    });

    // Maneja los cambios en los inputs del formulario
    const handleChange = (e) => {
        // Actualiza el estado del rol basado en el input modificado
        setRole({ ...role, [e.target.name]: e.target.value });
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que se recargue la página al enviar

        // Envia los datos del nuevo rol a la API
        axios.post("https://api1.sunger.xdn.com.mx/api/roles/", role)
            .then(() => {
                alert("Rol registrado"); // Notifica al usuario
                // Redirige al listado de roles después de registrar
                window.location.href = "https://web.sunger.xdn.com.mx/role-manage";
            })
            .catch(error => console.error(error)); // Muestra errores en consola
    };

    // Verificación de permisos para acceder al formulario
    const id_usuario = sessionStorage.getItem("id"); // Obtiene el ID del usuario en sesión

    // Solicita los datos del usuario desde la API
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            // Si el usuario no es "Dueño" (rol 1), redirige a la página de inicio
            if (storedUser && storedUser.id_rol != 1) {
                window.location.href = "https://web.sunger.xdn.com.mx/home";
            }
        })
        .catch((error) => {
            // Si el usuario no existe, lo manda a login
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                console.error("An error occurred while checking for the email:", error);
            }
        });

    // Render del formulario
    return (
        <div>
            <h1>Registro de Roles</h1>

            {/* Formulario para registrar el rol */}
            <form onSubmit={handleSubmit}>
                {/* Campo para nombre del rol */}
                <input
                    type="text"
                    name="nombre_rol"
                    placeholder="Nombre del rol"
                    onChange={handleChange}
                    required
                /><br/><br/>

                {/* Campo para definir permisos (texto libre) */}
                <input
                    type="text"
                    name="permisos"
                    placeholder="Permisos"
                    onChange={handleChange}
                /><br/><br/>

                {/* Botón para enviar el formulario */}
                <button type="submit">Agregar Rol</button>
            </form><br/><br/>

            {/* Botón para cancelar y volver al listado de roles */}
            <a href="https://web.sunger.xdn.com.mx/role-manage">
                <button>Cancelar</button>
            </a>
        </div>
    );
};

// Exporta el componente
export default RoleForm;
