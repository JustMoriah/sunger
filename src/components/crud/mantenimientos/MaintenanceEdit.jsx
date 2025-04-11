// Importación de hooks y librerías necesarias
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para obtener parámetros de la URL
import axios from "axios"; // Para hacer peticiones HTTP

// Componente para editar un mantenimiento ya registrado
const MaintenanceEdit = () => {
    // Estado para almacenar usuarios y cargadores (para los selects)
    const [users, setUsers] = useState([]);
    const [chargers, setChargers] = useState([]);

    // Obtiene el ID del mantenimiento desde la URL
    const { id } = useParams();

    // Estado inicial del mantenimiento a editar
    const [maintenance, setMaintenance] = useState({
        id_cargador: "",
        id_usuario: "", 
        fecha: "",
        tipo: "",
        descripcion: ""
    });

    // useEffect para cargar los datos iniciales
    useEffect(() => {
        // Obtener datos del mantenimiento específico por ID
        axios.get(`https://api1.sunger.xdn.com.mx/api/maintenance/id/${id}`)
            .then(response => {
                // Formatear la fecha a formato YYYY-MM-DD
                const formattedDate = new Date(response.data.fecha).toISOString().split('T')[0];
                setMaintenance({ ...response.data, fecha: formattedDate });
            })
            .catch(error => console.error(error));

        // Obtener lista de usuarios para el selector
        axios.get("https://api1.sunger.xdn.com.mx/api/users/")
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));

        // Obtener lista de cargadores para el selector
        axios.get("https://api1.sunger.xdn.com.mx/api/chargers/")
            .then(response => setChargers(response.data))
            .catch(error => console.error(error));
    }, [id]); // Solo se ejecuta cuando cambia el ID

    // Maneja los cambios en los inputs y actualiza el estado del mantenimiento
    const handleChange = (e) => {
        setMaintenance({ ...maintenance, [e.target.name]: e.target.value });
    };

    // Enviar los datos actualizados a la API
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://api1.sunger.xdn.com.mx/api/maintenance/id/${id}`, maintenance)
            .then(() => {
                alert("Mantenencia actualizado");
                // Redirige a la lista de mantenimientos
                window.location.href = "https://web.sunger.xdn.com.mx/maintenance";
            })
            .catch(error => console.error(error));
    };

    // Verifica si el usuario tiene permisos para acceder
    const id_usuario = sessionStorage.getItem("id");
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                // Solo dueños (rol 1) o admins (rol 2) pueden editar
                if (storedUser.id_rol != 1 && storedUser.id_rol != 2) {
                    window.location.href = "https://web.sunger.xdn.com.mx/home";
                }
            }
        })
        .catch((error) => {
            // Redirige al login si el usuario no existe
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                console.error("An error occurred while checking for the email:", error);
            }
        });

    // Render del formulario de edición
    return (
        <div>
            <h1>Actualizar Mantenimiento</h1>
            <form onSubmit={handleSubmit}>
                {/* Selector de cargador */}
                <select name="id_cargador" value={maintenance.id_cargador} onChange={handleChange} required>
                    <option value="">-- Selecciona Cargador --</option>
                    {chargers.length > 0 ? (
                        chargers.map((charger) => (
                            <option key={charger.id_cargador} value={charger.id_cargador}>
                                {charger.id_cargador} - {charger.ubicacion}
                            </option>
                        ))
                    ) : (
                        <option value="">Cargadores no encontrados</option>
                    )}
                </select><br/><br/>

                {/* Selector de usuario */}
                <select name="id_usuario" value={maintenance.id_usuario} onChange={handleChange} required>
                    <option value="">-- Selecciona Usuario --</option>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <option key={user.id_usuario} value={user.id_usuario}>
                                {user.id_usuario} - {user.correo}
                            </option>
                        ))
                    ) : (
                        <option value="">Usuarios no encontrados</option>
                    )}
                </select><br/><br/>

                {/* Fecha del mantenimiento */}
                <input type="date" name="fecha" value={maintenance.fecha} onChange={handleChange} /><br/><br/>

                {/* Tipo de mantenimiento */}
                <select name="tipo" value={maintenance.tipo} onChange={handleChange} required>
                    <option value="Rutino">Rutino</option>
                    <option value="Reparativo">Reparativo</option>
                </select><br/><br/>

                {/* Descripción del mantenimiento */}
                <textarea
                    name="descripcion"
                    placeholder="Descripcion"
                    value={maintenance.descripcion}
                    onChange={handleChange}
                    rows="5"
                    cols="50"
                    required
                /><br/><br/>

                {/* Botón para actualizar */}
                <button type="submit">Actualizar mantenimiento</button>
            </form><br />

            {/* Botón para cancelar y volver */}
            <a href="https://web.sunger.xdn.com.mx/maintenance"><button>Cancelar</button></a>
        </div>
    );
};

// Exportación del componente
export default MaintenanceEdit;
