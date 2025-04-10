import { useState } from "react";
import axios from "axios";

const ChargerForm = () => {
    const [charger, setCharger] = useState({
        ubicacion: "",
        estado: "0"
    });

    const handleChange = (e) => {
        setCharger({ ...charger, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://api1.sunger.xdn.com.mx/api/chargers/", charger)
            .then(() => {alert("Cargador registrado")
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
            <h1>Registro de Cargadores</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="ubicacion" placeholder="Ubicacion" onChange={handleChange} required/><br/><br/>
                <label>Estado: </label>
                <select name="estado" onChange={handleChange} required>
                    <option value="0">No disponible</option>
                    <option value="1">Disponible</option>
                    <option value="2">En mantenimiento</option>
                </select><br/><br/>
                <button type="submit">Agregar Cargador</button>
            </form><br/>
            <a href="https://web.sunger.xdn.com.mx/charger-manage"><button>Cancelar</button></a>
        </div>
    );
};

export default ChargerForm;