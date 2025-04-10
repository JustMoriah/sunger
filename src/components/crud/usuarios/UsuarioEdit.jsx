import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UsuarioEdit = () => {
    const { id } = useParams();
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

    useEffect(() => {
        axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id}`)
            .then(response => {
                // Format the fn value to YYYY-MM-DD (strip the time part)
                const formattedDate = new Date(response.data.fn).toISOString().split('T')[0];
                setUser({ ...response.data, fn: formattedDate });
            })
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://api1.sunger.xdn.com.mx/api/users/id/${id}`, user)
            .then(() => {alert("Usuario actualizado")
                window.location.href = "https://web.sunger.xdn.com.mx/user-manage";
            })
            .catch(error => console.error(error));
    };

    const id_usuario = sessionStorage.getItem("id");
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
            if (storedUser.id_rol != 1) {
                window.location.href = "https://web.sunger.xdn.com.mx/home";
            }
            }
        })
        .catch((error) => {
        if (error.response && error.response.status === 404) {
            window.location.href = "https://web.sunger.xdn.com.mx/login";
        } else {
            console.error("An error occurred while checking for the email:", error);
        }
    });
    return (
        <div>
            <h1>Actualizar Usuario</h1>
            <form onSubmit={handleSubmit}>
                <label>Rol: </label>
                <select name="id_rol" value={user.id_rol} onChange={handleChange} required>
                    <option value="1">Dueno</option>
                    <option value="2">Admin</option>
                    <option value="3">Usuario</option>
                </select><br /><br />
                <input type="text" name="nombre" placeholder="Nombre" value={user.nombre} onChange={handleChange} required /><br /><br />
                <input type="text" name="apellido" placeholder="Apellido Paterno" value={user.apellido} onChange={handleChange} required /><br /><br />
                <input type="date" name="fn" value={user.fn} onChange={handleChange} required /><br /><br />
                <select name="genero" value={user.genero} onChange={handleChange}>
                <option value="">--Selecciona un genero--</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No Binario">No Binario</option>
                    <option value="-">Prefiero no decir</option>
                </select><br/><br/>
                <input type="email" name="correo" placeholder="Correo Electronico" value={user.correo} onChange={handleChange} required /><br /><br />
                <input type="password" name="contrasena" placeholder="Contraseña" value={user.contrasena} onChange={handleChange} required /><br /><br />
                <select name="activo" value={user.activo} onChange={handleChange} required>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select><br/><br/>
                <button type="submit">Actualizar Usuario</button>
            </form><br />
            <a href="https://web.sunger.xdn.com.mx/user-manage"><button>Cancelar</button></a>
        </div>
    );
};

export default UsuarioEdit;
