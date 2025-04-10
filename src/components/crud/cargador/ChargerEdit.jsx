import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChargerEdit = () => {
    const { id } = useParams();
    const [charger, setCharger] = useState({
        ubicacion: "",
        estado: ""
    });

    useEffect(() => {
        axios.get(`https://api1.sunger.xdn.com.mx/api/chargers/id/${id}`)
            .then(response => {
                setCharger({ ...response.data });
            })
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setCharger({ ...charger, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://api1.sunger.xdn.com.mx/api/chargers/id/${id}`, charger)
            .then(() => {alert("Rol actualizado")
                window.location.href = "https://web.sunger.xdn.com.mx/charger-manage";
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
            <h1>Actualizar Cargador</h1>
            <form onSubmit={handleSubmit}>
            <input type="text" name="ubicacion" placeholder="Ubicacion" value={charger.ubicacion} onChange={handleChange} required/><br/><br/>
                <label>Estado: </label>
                <select name="estado" value={charger.estado} onChange={handleChange} required>
                    <option value="0">No disponible</option>
                    <option value="1">Disponible</option>
                    <option value="2">En mantenimiento</option>
                </select><br/><br/>
            <button type="submit">Actualizar Cargador</button>
            </form><br />
            <a href="https://web.sunger.xdn.com.mx/charger-manage"><button>Cancelar</button></a>
        </div>
    );
};

export default ChargerEdit;
