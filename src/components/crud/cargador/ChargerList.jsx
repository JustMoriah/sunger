// Importaciones necesarias desde React y otras librerías
import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

// Componente principal ChargerList
export default function ChargerList() {
  // Estado para guardar los cargadores obtenidos de la API
  const [chargers, setChargers] = useState([]);

  // ID del usuario activo desde sessionStorage
  const id_usuario = sessionStorage.getItem("id");

  // Estado para guardar el rol del usuario logueado
  const [userRole, setUserRole] = useState(null);

  // Estados relacionados con paginación
  const [pageNumber, setPageNumber] = useState(0);      // Página actual
  const [perPage, setPerPage] = useState(10);           // Cargadores por página
  const [newPerPage, setNewPerPage] = useState(perPage); // Nuevo valor editable

  // useEffect para cargar la lista de cargadores una vez al montar el componente
  useEffect(() => {
    axios.get("https://api1.sunger.xdn.com.mx/api/chargers/")
        .then(response => setChargers(response.data))
        .catch(error => console.error(error));
  }, []);

  // Función para eliminar un cargador por ID
  const handleDelete = (id) => {
    axios.delete(`https://api1.sunger.xdn.com.mx/api/chargers/id/${id}`)
        .then(() => {
          // Eliminar del estado el cargador eliminado
          setChargers(chargers.filter(charger => charger.id_cargador !== id));
          alert("Cargador ha sido eliminado.");
          // Redireccionar para refrescar la lista (esto es opcional)
          window.location.href = "https://web.sunger.xdn.com.mx/charger-manage";
        })
        .catch(error => console.error(error));
  };

  // Verificación de rol del usuario (debería estar dentro de useEffect para evitar múltiples llamadas)
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
        const storedUser = response.data;
        if (storedUser) {
            setUserRole(storedUser.id_rol); // Guardar rol para mostrar u ocultar botones
        }
    })
    .catch((error) => {
        if (error.response && error.response.status === 404) {
            window.location.href = "https://web.sunger.xdn.com.mx/login";
        } else {
            console.error("An error occurred while fetching user data:", error);
        }
    });

  // Calcular cargadores de la página actual
  const currentPageChargers = chargers.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  // Función que actualiza el número de página seleccionada
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Manejo de cambios en el input de "por página"
  const handlePerPageChange = (e) => {
    setNewPerPage(Number(e.target.value));
  };

  // Aplicar nuevo valor de registros por página
  const handleApplyPerPage = () => {
    setPerPage(newPerPage);
  };

  return (
    <div>
      {/* Selector de cuántos cargadores mostrar por página */}
      <form>
        <label>Cargadores por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button>
      </form>

      {/* Tabla que muestra los cargadores */}
      <div className='table-container'>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Ubicación</th>
              <th>Estado</th>
              {/* Mostrar botón para registrar cargador si el usuario es administrador */}
              {userRole === 1 ? (
                <th>
                  <a href='https://web.sunger.xdn.com.mx/charger/create'>
                    <button>Registrar cargador</button>
                  </a>
                </th>
              ) : (
                <p></p>
              )}
            </tr>

            {/* Renderizar los cargadores de la página actual */}
            {currentPageChargers.map(charger => (
              <tr key={charger.id_cargador}>
                <td>{charger.id_cargador}</td>
                <td>{charger.ubicacion}</td>
                <td>{charger.estado}</td>
                {/* Mostrar botones de acción solo si el usuario es admin */}
                {userRole === 1 ? (
                  <td className="action-buttons">
                    <Link to={`/charger/edit/${charger.id_cargador}`}>
                      <button>Editar</button>
                    </Link>
                    <button onClick={() => handleDelete(charger.id_cargador)}>Eliminar</button>
                  </td>
                ) : (
                  <p></p>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Componente de paginación */}
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(chargers.length / perPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  )
}
