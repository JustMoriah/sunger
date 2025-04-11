// Importa los hooks useState y useEffect de React
import { useState, useEffect } from "react";
// Importa useParams de React Router para acceder a los parámetros de la URL
import { useParams } from "react-router-dom";
// Importa la librería axios para hacer peticiones HTTP
import axios from "axios";

// Componente funcional ChargerEdit
const ChargerEdit = () => {
    // Extrae el parámetro 'id' desde la URL
    const { id } = useParams();

    // Estado local para guardar la información del cargador
    const [charger, setCharger] = useState({
        ubicacion: "",
        estado: ""
    });

    // useEffect que se ejecuta al montar el componente o cuando cambia el 'id'
    useEffect(() => {
        // Hace una petición GET para obtener los datos del cargador por su ID
        axios.get(`https://api1.sunger.xdn.com.mx/api/chargers/id/${id}`)
            .then(response => {
                // Al recibir la respuesta, actualiza el estado con los datos del cargador
                setCharger({ ...response.data });
            })
            .catch(error => console.error(error)); // Muestra errores en consola si hay un fallo
    }, [id]);

    // Manejador de cambios para los inputs del formulario
    const handleChange = (e) => {
        // Actualiza el estado del cargador con el nuevo valor
        setCharger({ ...charger, [e.target.name]: e.target.value });
    };

    // Manejador del submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene la recarga de la página

        // Realiza una petición PUT para actualizar el cargador
        axios.put(`https://api1.sunger.xdn.com.mx/api/chargers/id/${id}`, charger)
            .then(() => {
                // Si la actualización es exitosa, muestra un mensaje y redirige
                alert("Rol actualizado");
                window.location.href = "https://web.sunger.xdn.com.mx/charger-manage";
            })
            .catch(error => console.error(error)); // Muestra errores en consola
    };

    // Verificación del usuario (autenticación y autorización)
    const id_usuario = sessionStorage.getItem("id");

    // Petición GET para obtener los datos del usuario y validar su rol
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;

            // Si el usuario no es administrador (rol distinto de 1), redirige al home
            if (storedUser) {
                if (storedUser.id_rol != 1) {
                    window.location.href = "https://web.sunger.xdn.com.mx/home";
                }
            }
        })
        .catch((error) => {
            // Si no se encuentra el usuario (404), redirige al login
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                // Muestra otros errores en consola
                console.error("An error occurred while checking for the email:", error);
            }
        });

    // Renderiza el formulario para editar un cargador
    return (
        <div>
            <h1>Actualizar Cargador</h1>
            <form onSubmit={handleSubmit}>
                {/* Input para editar la ubicación del cargador */}
                <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ubicacion"
                    value={charger.ubicacion}
                    onChange={handleChange}
                    required
                /><br /><br />

                {/* Selector para actualizar el estado del cargador */}
                <label>Estado: </label>
                <select
                    name="estado"
                    value={charger.estado}
                    onChange={handleChange}
                    required
                >
                    <option value="0">No disponible</option>
                    <option value="1">Disponible</option>
                    <option value="2">En mantenimiento</option>
                </select><br /><br />

                {/* Botón para enviar el formulario */}
                <button type="submit">Actualizar Cargador</button>
            </form><br />

            {/* Botón para cancelar y regresar a la gestión de cargadores */}
            <a href="https://web.sunger.xdn.com.mx/charger-manage">
                <button>Cancelar</button>
            </a>
        </div>
    );
};

// Exporta el componente para que pueda ser utilizado en otros lugares
export default ChargerEdit;
