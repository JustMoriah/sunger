// Importamos el hook useState de React y axios para realizar las peticiones HTTP
import { useState } from "react";
import axios from "axios";

// Componente SignUp (Registro de usuario)
const SignUp = () => {
    // Definimos el estado 'user' para almacenar la información del formulario de registro
    const [user, setUser] = useState({
        id_rol: 3, // Rol predeterminado del usuario
        nombre: "", // Nombre del usuario
        apellido: "", // Apellido del usuario
        fn: "", // Fecha de nacimiento
        genero: "", // Género del usuario
        correo: "", // Correo electrónico del usuario
        contrasena: "", // Contraseña del usuario
        activo: 1, // Estado del usuario (activo)
    });

    // Función que maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Actualiza el estado con el valor del campo modificado
    };

    // Función que maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenimos que la página se recargue al enviar el formulario
    
        // Hacemos una solicitud GET para verificar si el correo ya está registrado
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/correo/${user.correo}`)
            .then((response) => {
                // Si ya existe un usuario con el mismo correo, mostramos un mensaje de alerta
                if (response.data) {
                    alert("El correo ingresado ya esta en uso, por favor elige uno diferente o inicia sesion.");
                }
            })
            .catch((error) => {
                // Si el correo no está registrado (404), procedemos a registrar al usuario
                if (error.response && error.response.status === 404) {
                    // Hacemos una solicitud POST para registrar al nuevo usuario
                    axios.post("https://api1.sunger.xdn.com.mx/api/users/", user)
                        .then(() => {
                            alert("Usuario registrado"); // Mostramos un mensaje de éxito
                            window.location.href = "https://web.sunger.xdn.com.mx/login"; // Redirigimos a la página de inicio de sesión
                        })
                        .catch((error) => console.error(error)); // Si ocurre un error en la solicitud POST, lo mostramos en la consola
                } else {
                    console.error("An error occurred while checking for the user:", error); // Si ocurre un error en la verificación del correo, lo mostramos en la consola
                }
            });
    };

    return (
        <div>
            {/* Sección del formulario de registro */}
            <div class="login">
                <h1>Registrarse</h1>
                <form onSubmit={handleSubmit}>
                    {/* Campos del formulario para capturar los datos del usuario */}
                    <input type="email" name="correo" placeholder="Correo Electronico" onChange={handleChange} required/><br/><br/>
                    <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/><br/><br/>
                    <input type="text" name="nombre" placeholder="Nombre(s)" onChange={handleChange} required/><br/><br/>
                    <input type="text" name="apellido" placeholder="Apellido(s)" onChange={handleChange} required/><br/><br/>
                    <input type="date" name="fn" onChange={handleChange} required/><br/><br/>
                    <select name="genero" onChange={handleChange} required>
                        <option value="">--Selecciona tu genero--</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="No Binario">No Binario</option>
                        <option value="-">Prefiero no decir</option>
                    </select><br/><br/>
                    <button type="submit">Registrarse</button>
                </form><br/>
            </div>

            {/* Enlace para redirigir a la página de inicio de sesión */}
            <p>¿Ya tienes cuenta? <a href="https://web.sunger.xdn.com.mx/login">Inicia sesion</a>.</p>
        </div>
    );
};

export default SignUp;
