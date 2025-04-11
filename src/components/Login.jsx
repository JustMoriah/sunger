import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos el hook useNavigate para la navegación
import axios from "axios";

const Login = () => {
    // Estado para almacenar los valores de correo y contraseña ingresados por el usuario
    const [user, setUser] = useState({
        correo: "",
        contrasena: ""
    });

    // Función para manejar los cambios en los campos de entrada
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const currentDate = new Date();
    const navigate = useNavigate(); // Hook para la navegación programática

    // Función que maneja el envío del formulario de inicio de sesión
    const handleSubmit = (e) => {
        e.preventDefault();

        // Hacemos una solicitud GET a la API para obtener el usuario con el correo proporcionado
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/correo/${user.correo}`)
            .then((response) => {
                const storedUser = response.data; // Datos del usuario obtenidos de la respuesta de la API
                
                // Verificamos si el usuario existe
                if (storedUser) {
                    // Comprobamos si la contraseña ingresada coincide con la almacenada
                    if (storedUser.contrasena === user.contrasena) {
                        // Guardamos el ID del usuario en sessionStorage para persistir la sesión
                        sessionStorage.setItem("id", `${storedUser.id_usuario}`);
    
                        // Validamos que el id_usuario sea un valor válido
                        if (!storedUser.id_usuario || isNaN(storedUser.id_usuario)) {
                            console.error('Invalid id_usuario:', storedUser.id_usuario);
                            return;
                        }
    
                        // Formateamos la fecha actual para enviarla en formato compatible con MySQL
                        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    
                        // Construimos el objeto de datos para registrar el login
                        const loginData = {
                            id_usuario: storedUser.id_usuario,
                            accion: "Login",
                            hora: formattedDate, // Enviamos la fecha correctamente formateada
                        };
    
                        console.log('Sending login data:', loginData);
    
                        // Enviamos el registro de login a la API
                        axios.post("https://api1.sunger.xdn.com.mx/api/logins/", loginData)
                            .then(() => console.log("Login registrado correctamente"))
                            .catch(error => {
                                console.error("Error al registrar login:", error);
                            });
    
                        // Redirigimos al usuario a su página correspondiente dependiendo de su rol
                        if (storedUser.id_rol === 1) {
                            navigate("/home");
                        } else if (storedUser.id_rol === 2) {
                            navigate("/maintenance");
                        } else if (storedUser.id_rol === 3) {
                            navigate("/home");
                        }
                    } else {
                        // Si la contraseña es incorrecta, mostramos un mensaje de alerta
                        alert("Contraseña incorrecta.");
                    }
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    // Si el usuario no se encuentra, redirigimos a la página de registro
                    alert("Usuario no encontrado, por favor registrate.");
                    navigate("/signup");
                } else {
                    console.error("An error occurred while checking for the email:", error);
                }
            });
    };

    return (
        <div>
            <div className="login">
                <h1>Iniciar Sesion</h1>
                {/* Formulario de inicio de sesión */}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="correo" 
                        placeholder="Correo Electronico" 
                        onChange={handleChange} 
                        required
                    /><br/><br/>
                    <input 
                        type="password" 
                        name="contrasena" 
                        placeholder="Contraseña" 
                        onChange={handleChange} 
                        required
                    /><br/><br/>
                    <button type="submit">Iniciar Sesion</button>
                </form><br/>
            </div>
            {/* Enlace para redirigir a la página de registro */}
            <p>¿No tienes cuenta? <a href="https://web.sunger.xdn.com.mx/signup">Registrate</a>.</p>
        </div>
    );
};

export default Login;
