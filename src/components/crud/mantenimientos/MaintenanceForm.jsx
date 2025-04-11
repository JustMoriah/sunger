// Importación de hooks y librería axios
import { useEffect, useState } from "react";
import axios from "axios";

// Componente para registrar un nuevo mantenimiento
const MaintenanceForm = () => {
    // Estados para almacenar usuarios y cargadores disponibles
    const [users, setUsers] = useState([]);
    const [chargers, setChargers] = useState([]);

    // Estado para guardar los datos del formulario de mantenimiento
    const [maintenance, setMaintenance] = useState({
        id_cargador: "" ,
        id_usuario: "", 
        fecha: "",
        tipo: "Rutino", // Valor por defecto
        descripcion: ""
    });

    // useEffect que se ejecuta al cargar el componente
    useEffect(() => {
        // Obtener todos los usuarios
        axios.get("https://api1.sunger.xdn.com.mx/api/users/")
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));

        // Obtener todos los cargadores
        axios.get("https://api1.sunger.xdn.com.mx/api/chargers/")
            .then(response => setChargers(response.data))
            .catch(error => console.error(error));
    }, []);

    // Maneja los cambios en los inputs y actualiza el estado
    const handleChange = (e) => {
        setMaintenance({ ...maintenance, [e.target.name]: e.target.value });
    };

    // Envía los datos del formulario a la API
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://api1.sunger.xdn.com.mx/api/maintenance/", maintenance)
            .then(() => {
                alert("Mantenimiento registrado");
                // Redirige a la lista de mantenimientos
                window.location.href = "https://web.sunger.xdn.com.mx/maintenance";
            })
            .catch(error => console.error(error));
    };

    // Verificación de permisos del usuario actual
    const id_usuario = sessionStorage.getItem("id");
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
        const storedUser = response.data;
        if (storedUser) {
            // Solo los usuarios con rol 1 (Dueño) o 2 (Admin) pueden acceder
            if (storedUser.id_rol != 1 && storedUser.id_rol != 2) {
                window.location.href = "https://web.sunger.xdn.com.mx/home";
            }
        }
    })
    .catch((error) => {
        // Redirige al login si no se encuentra al usuario
        if (error.response && error.response.status === 404) {
            window.location.href = "https://web.sunger.xdn.com.mx/login";
        } else {
            console.error("An error occurred while checking for the email:", error);
        }
    });

    // Render del formulario
    return (
        <div>
            <h1>Registro de Mantenimiento</h1>
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

                {/* Fecha de mantenimiento */}
                <input type="date" name="fecha" onChange={handleChange}/><br/><br/>

                {/* Tipo de mantenimiento */}
                <select name="tipo" onChange={handleChange} required>
                    <option value="Rutino">Rutino</option>
                    <option value="Reparativo">Reparativo</option>
                </select><br/><br/>

                {/* Descripción del mantenimiento */}
                <textarea name="descripcion" placeholder="Descripcion" onChange={handleChange} rows="5" cols="50"/><br/><br/>

                {/* Botón para registrar */}
                <button type="submit">Agregar Mantenimiento</button>
            </form><br/><br/>

            {/* Botón para cancelar y volver a la vista de mantenimientos */}
            <a href="https://web.sunger.xdn.com.mx/maintenance"><button>Cancelar</button></a>
        </div>
    );
};

// Exportación del componente
export default MaintenanceForm;
