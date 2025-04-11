// Importamos React para poder crear el componente y también importamos el componente UserPage desde su ruta correspondiente
import React from "react"; 
import UserPage from "../components/UserPage";

// Componente funcional "Home" que devuelve el componente UserPage dentro de un contenedor <div>
const Home = () => {
    return (
        <div>
            {/* Aquí se incluye el componente UserPage */}
            <UserPage/>
        </div>
    );
};

// Exportamos el componente "Home" para poder utilizarlo en otras partes de la aplicación
export default Home;
