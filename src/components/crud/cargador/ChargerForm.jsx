// Importa el hook useState desde React y la librería axios para hacer peticiones HTTP
import { useState } from "react";
import axios from "axios";

// Componente funcional ChargerForm
const ChargerForm = () => {
    // Estado local para almacenar los datos del cargador
    const [charger, setCharger] = useState({
        ubicacion: "",
        estado: "0"
    });

    // Manejador de cambios en los inputs del formulario
    const handleChange = (e) => {
        // Actualiza el estado del cargador con el nuevo valor ingresado
        setCharger({ ...charger, [e.target.name]: e.target.value });
    };

    // Manejador del evento submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)

        // Realiza una petición POST para registrar un nuevo cargador
        axios.post("https://api1.sunger.xdn.com.mx/api/chargers/", charger)
            .then(() => {
                // Si la petición es exitosa, muestra un mensaje y redirige a otra página
                alert("Cargador registrado");
                window.location.href = "https://web.sunger.xdn.com.mx/charger-manage";
            })
            .catch(error => console.error(error)); // Muestra errores en consola si algo falla
    };

    // Obtiene el ID del usuario desde el sessionStorage
    const id_usuario = sessionStorage.getItem("id");

    // Realiza una petición GET para obtener los datos del usuario por su ID
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;

            // Si existe el usuario y su rol no es administrador, redirige a la página de inicio
            if (storedUser) {
                if (storedUser.id_rol != 1) {
                    window.location.href = "https://web.sunger.xdn.com.mx/home";
                }
            }
        })
        .catch((error) => {
            // Si el error es 404 (usuario no encontrado), redirige a la página de login
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                // Si ocurre otro error, lo muestra en la consola
                console.error("An error occurred while checking for the email:", error);
            }
        });

    // Renderiza el formulario para registrar un cargador
    return (
        <div>
            <h1>Registro de Cargadores</h1>
            <form onSubmit={handleSubmit}>
                {/* Input para ingresar la ubicación del cargador */}
                <input type="text" name="ubicacion" placeholder="Ubicacion" onChange={handleChange} required /><br /><br />
                
                {/* Selector de estado del cargador */}
                <label>Estado: </label>
                <select name="estado" onChange={handleChange} required>
                    <option value="0">No disponible</option>
                    <option value="1">Disponible</option>
                    <option value="2">En mantenimiento</option>
                </select><br /><br />

                {/* Botón para enviar el formulario */}
                <button type="submit">Agregar Cargador</button>
            </form><br />

            {/* Botón para cancelar y regresar a la gestión de cargadores */}
            <a href="https://web.sunger.xdn.com.mx/charger-manage">
                <button>Cancelar</button>
            </a>
        </div>
    );
};

// Exporta el componente para que pueda ser usado en otras partes de la aplicación
export default ChargerForm;
