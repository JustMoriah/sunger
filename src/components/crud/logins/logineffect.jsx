// Importación de hooks de React, librerías externas y componentes necesarios
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate';

// Componente funcional que muestra la lista de logins
const LoginList = () => {
  // Estado para almacenar los registros de logins
  const [logins, setLogins] = useState([]);

  // Obtener el ID del usuario desde sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // Estado para el rol del usuario logueado
  const [userRole, setUserRole] = useState(null);

  // Estados para la paginación
  const [pageNumber, setPageNumber] = useState(0); // Página actual
  const [perPage, setPerPage] = useState(10);      // Registros por página
  const [newPerPage, setNewPerPage] = useState(perPage); // Nuevo valor de perPage en input

  // useEffect que se ejecuta al montar el componente para cargar los logins
  useEffect(() => {
    axios.get("https://api1.sunger.xdn.com.mx/api/logins/")
      .then(response => {
        setLogins(response.data); // Guardar logins obtenidos
      })
      .catch(error => {
        console.error("Error al obtener los logins:", error); // Manejo de errores
        alert("Hubo un error al cargar los logins.");
      });
  }, []);

  // Función para eliminar un registro de login
  const handleDelete = (id_log) => {
    // Confirmar acción antes de eliminar
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      axios.delete(`https://api1.sunger.xdn.com.mx/api/logins/id/${id_log}`)
        .then(() => {
          // Filtrar el login eliminado del estado
          setLogins(logins.filter(login => login.id_log !== id_log));
        })
        .catch(error => {
          console.error("Error al eliminar el login:", error);
          alert("Hubo un error al eliminar el login.");
        });
    }
  };

  // Obtener datos del usuario actual para verificar el rol
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      const storedUser = response.data;
      if (storedUser) {
        setUserRole(storedUser.id_rol); // Guardar rol del usuario
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // Redireccionar al login si no se encuentra el usuario
        window.location.href = "https://web.sunger.xdn.com.mx/login";
      } else {
        console.error("An error occurred while fetching user data:", error);
      }
    });

  // Calcular qué registros se muestran en la página actual
  const currentPageLogins = logins.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  // Manejador de cambio de página en la paginación
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Manejador para el input que cambia la cantidad de registros por página
  const handlePerPageChange = (e) => {
    setNewPerPage(Number(e.target.value));
  };

  // Aplicar el nuevo valor de registros por página
  const handleApplyPerPage = () => {
    setPerPage(newPerPage);
  };

  // Render del componente
  return (
    <div>
      {/* Formulario para ajustar el número de registros por página */}
      <form>
        <label>Logins por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button>
      </form>

      {/* Tabla de logins */}
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Usuario</th>
              <th>Acción</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {/* Renderizar cada registro de login */}
            {currentPageLogins.map((login) => (
              <tr key={login.id_log}>
                <td>{login.id_log}</td>
                <td>{login.id_usuario}</td>
                <td>{login.accion}</td>
                <td>{login.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Componente de paginación */}
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(logins.length / perPage)} // Total de páginas
        onPageChange={handlePageClick} // Cambio de página
        containerClassName={"pagination"} // Clase CSS para contenedor
        activeClassName={"active"} // Clase CSS para la página activa
      />
    </div>
  );
};

// Exportar el componente para su uso en otras partes de la app
export default LoginList;
