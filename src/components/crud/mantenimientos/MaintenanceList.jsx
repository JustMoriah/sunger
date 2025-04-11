// Importación de módulos necesarios
import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

// Componente principal
export default function MaintenanceList() {
  // Estados para manejar datos de mantenimiento, usuario, paginación, etc.
  const [maintenance, setMaintenance] = useState([]); // Lista de mantenimientos
  const id_usuario = sessionStorage.getItem("id"); // ID del usuario actual
  const [userRole, setUserRole] = useState(null); // Rol del usuario (para permisos)
  const [pageNumber, setPageNumber] = useState(0); // Página actual
  const [perPage, setPerPage] = useState(10); // Registros por página
  const [newPerPage, setNewPerPage] = useState(perPage); // Para cambiar la cantidad de registros por página

  // Hook que se ejecuta al cargar el componente
  useEffect(() => {
    // Obtiene todos los registros de mantenimiento
    axios.get("https://api1.sunger.xdn.com.mx/api/maintenance/")
      .then(response => {
        // Formatea la fecha a formato YYYY-MM-DD
        const formattedMaintenance = response.data.map(maintenance => {
          const formattedDate = new Date(maintenance.fecha).toISOString().split('T')[0];
          return { ...maintenance, fecha: formattedDate };
        });
        setMaintenance(formattedMaintenance);
      })
      .catch(error => console.error(error));
  }, []);

  // Elimina un registro de mantenimiento
  const handleDelete = (id) => {
    axios.delete(`https://api1.sunger.xdn.com.mx/api/maintenance/id/${id}`)
      .then(() => {
        // Filtra el mantenimiento eliminado y actualiza el estado
        setMaintenance(maintenance.filter(maintenance => maintenance.id_historial !== id));
        alert("Historial de mantenimiento ha sido eliminado.");
        window.location.href = "https://web.sunger.xdn.com.mx/maintenance";
      })
      .catch(error => console.error(error));
  };

  // Verifica el rol del usuario actual
  axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
    .then((response) => {
      const storedUser = response.data;
      if (storedUser) {
        setUserRole(storedUser.id_rol); // Guarda el rol del usuario
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = "https://web.sunger.xdn.com.mx/login"; // Redirige si el usuario no existe
      } else {
        console.error("An error occurred while fetching user data:", error);
      }
    });

  // Obtiene los elementos de mantenimiento de la página actual
  const currentPageMain = maintenance.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  // Manejadores para la paginación
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const handlePerPageChange = (e) => {
    setNewPerPage(Number(e.target.value)); // Actualiza el valor temporal
  };

  const handleApplyPerPage = () => {
    setPerPage(newPerPage); // Aplica el nuevo valor de registros por página
  };

  // Renderizado del componente
  return (
    <div>
      {/* Formulario para cambiar cuántos registros se muestran por página */}
      <form>
        <label>Mantenimientos por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button>
      </form>

      <div className='table-container'>
        {/* Botón para registrar mantenimiento (solo Admins - rol 2) */}
        {userRole === 2 ? (
          <a href='https://web.sunger.xdn.com.mx/maintenance/create'><button>Registrar mantenimiento</button></a>
        ) : (
          <p></p>
        )}

        {/* Tabla de mantenimientos */}
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>ID Cargador</th>
              <th>ID Usuario</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              {/* Botón extra visible solo para Dueños (rol 1) */}
              {userRole === 1 ? (
                <th><a href='https://web.sunger.xdn.com.mx/maintenance/create'><button>Registrar mantenimiento</button></a></th>
              ) : (
                <p></p>
              )}
            </tr>

            {/* Renderiza los mantenimientos de la página actual */}
            {currentPageMain.map(maintenance => (
              <tr key={maintenance.id_historial}>
                <td>{maintenance.id_historial}</td>
                <td>{maintenance.id_cargador}</td>
                <td>{maintenance.id_usuario}</td>
                <td>{maintenance.fecha}</td>
                <td>{maintenance.tipo}</td>
                <td>{maintenance.descripcion}</td>
                {/* Botones de editar y eliminar visibles solo para Dueños */}
                {userRole === 1 ? (
                  <td className="action-buttons">
                    <Link to={`/maintenance/edit/${maintenance.id_historial}`}><button>Editar</button></Link>
                    <button onClick={() => handleDelete(maintenance.id_historial)}>Eliminar</button>
                  </td>
                ) : (
                  <p></p>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación con ReactPaginate */}
      <ReactPaginate
        previousLabel={"<"} // Botón anterior
        nextLabel={">"}     // Botón siguiente
        pageCount={Math.ceil(maintenance.length / perPage)} // Número total de páginas
        onPageChange={handlePageClick} // Cambio de página
        containerClassName={"pagination"} // Clase de estilo
        activeClassName={"active"} // Clase para página activa
      />
    </div>
  );
}
