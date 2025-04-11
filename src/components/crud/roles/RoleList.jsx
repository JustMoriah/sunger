import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

export default function RoleList() {
  const [roles, setRoles] = useState([]);  // Estado para los roles
  const id_usuario = sessionStorage.getItem("id");  // ID del usuario logueado
  const [userRole, setUserRole] = useState(null);  // Estado para el rol del usuario logueado
  const [pageNumber, setPageNumber] = useState(0);  // Estado para el número de la página actual
  const [perPage, setPerPage] = useState(10);  // Estado para definir cuántos roles mostrar por página
  const [newPerPage, setNewPerPage] = useState(perPage);  // Estado temporal para actualizar roles por página

  // Obtiene los roles de la API al cargar el componente
  useEffect(() => {
    axios.get("https://api1.sunger.xdn.com.mx/api/roles/")
        .then(response => setRoles(response.data))
        .catch(error => console.error(error));
  }, []);

  // Elimina un rol
  const handleDelete = (id) => {
    axios.delete(`https://api1.sunger.xdn.com.mx/api/roles/id/${id}`)
        .then(() => {
          // Filtra el rol eliminado de la lista y actualiza el estado
          setRoles(roles.filter(role => role.id_rol !== id));
          alert("Rol ha sido eliminado.");
          // Redirige a la página de administración de roles
          window.location.href = "https://web.sunger.xdn.com.mx/role-manage";
        })
        .catch(error => console.error(error));
  };

  // Obtiene los datos del usuario logueado y establece su rol
  useEffect(() => {
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                setUserRole(storedUser.id_rol);  // Establece el rol del usuario
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login";  // Redirige si el usuario no existe
            } else {
                console.error("An error occurred while fetching user data:", error);
            }
        });
  }, [id_usuario]);

  // Roles actuales que se muestran en la página según la paginación
  const currentPageRoles = roles.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  // Maneja el cambio de página
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);  // Actualiza el número de página cuando se hace clic
  };

  // Maneja el cambio en el número de roles por página
  const handlePerPageChange = (e) => {
    setNewPerPage(Number(e.target.value));  // Actualiza el estado con el nuevo valor
  };

  // Aplica el nuevo valor de roles por página
  const handleApplyPerPage = () => {
    setPerPage(newPerPage);  // Aplica el nuevo valor de roles por página
  };

  return (
    <div>
      {/* Formulario para cambiar el número de roles por página */}
      <form>
        <label>Roles por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button> {/* Botón para aplicar */}
      </form>

      <div className='table-container'>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Permisos</th>
              {/* Si el usuario tiene rol 1 (Dueño/Admin), muestra el botón para registrar un nuevo rol */}
              {userRole === 1 && (
                <th><a href='https://web.sunger.xdn.com.mx/role/create'><button>Registrar rol</button></a></th>
              )}
            </tr>
            {/* Muestra los roles de la página actual */}
            {currentPageRoles.map(role => (
              <tr key={role.id_rol}>
                <td>{role.id_rol}</td>
                <td>{role.nombre_rol}</td>
                <td>{role.permisos}</td>
                {/* Si el usuario tiene rol 1 (Dueño/Admin), muestra los botones para editar y eliminar */}
                {userRole === 1 && (
                  <td className="action-buttons">
                    <Link to={`/role/edit/${role.id_rol}`}><button>Editar</button></Link>
                    <button onClick={() => handleDelete(role.id_rol)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(roles.length / perPage)}  // Calcula el número total de páginas
        onPageChange={handlePageClick}  // Llama a handlePageClick cuando se cambia de página
        containerClassName={"pagination"}  // Estilos de paginación
        activeClassName={"active"}  // Estilos de la página activa
      />
    </div>
  );
}
