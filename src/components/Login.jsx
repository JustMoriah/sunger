import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [user, setUser] = useState({
        correo: "",
        contrasena: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const currentDate = new Date();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/correo/${user.correo}`)
            .then((response) => {
                const storedUser = response.data;
                if (storedUser) {
                    if (storedUser.contrasena === user.contrasena) {
                        sessionStorage.setItem("id", `${storedUser.id_usuario}`);
    
                        // Validate id_usuario
                        if (!storedUser.id_usuario || isNaN(storedUser.id_usuario)) {
                            console.error('Invalid id_usuario:', storedUser.id_usuario);
                            return;
                        }
    
                        const currentDate = new Date();
    
                        // Format the current date to MySQL DATETIME format: YYYY-MM-DD HH:MM:SS
                        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    
                        // Construct the login object
                        const loginData = {
                            id_usuario: storedUser.id_usuario,
                            accion: "Login",
                            hora: formattedDate, // Send the properly formatted date
                        };
    
                        console.log('Sending login data:', loginData);
    
                        // Send the POST request
                        axios.post("https://api1.sunger.xdn.com.mx/api/logins/", loginData)
                            .then(() => console.log("Login registrado correctamente"))
                            .catch(error => {
                                console.error("Error al registrar login:", error);
                            });
    
                        if (storedUser.id_rol === 1) {
                            navigate("/home");
                        } else if (storedUser.id_rol === 2) {
                            navigate("/maintenance");
                        } else if (storedUser.id_rol === 3) {
                            navigate("/home");
                        }
                    } else {
                        alert("Contraseña incorrecta.");
                    }
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
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
                <form onSubmit={handleSubmit}>
                    <input type="email" name="correo" placeholder="Correo Electronico" onChange={handleChange} required/><br/><br/>
                    <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/><br/><br/>
                    <button type="submit">Iniciar Sesion</button>
                </form><br/>
            </div>
            <p>¿No tienes cuenta? <a href="https://web.sunger.xdn.com.mx/signup">Registrate</a>.</p>
        </div>
    );
};

export default Login;
