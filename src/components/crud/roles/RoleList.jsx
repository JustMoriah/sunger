import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const id_usuario = sessionStorage.getItem("id");
  const [userRole, setUserRole] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [newPerPage, setNewPerPage] = useState(perPage);

  useEffect(() => {
    axios.get("https://api1.sunger.xdn.com.mx/api/roles/")
        .then(response => setRoles(response.data))
        .catch(error => console.error(error));
  }, []);

    const handleDelete = (id) => {
        axios.delete(`https://api1.sunger.xdn.com.mx/api/roles/id/${id}`)
            .then(() => {setRoles(roles.filter(role => role.id_rol !== id))
              alert("Rol ha sido eliminado.");
              window.location.href = "https://web.sunger.xdn.com.mx/role-manage";
            })
            .catch(error => console.error(error));
    };

    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                setUserRole(storedUser.id_rol);
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                window.location.href = "https://web.sunger.xdn.com.mx/login";
            } else {
                console.error("An error occurred while fetching user data:", error);
            }
        });

        const currentPageRoles = roles.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

        const handlePageClick = ({ selected }) => {
          setPageNumber(selected);
        };
      
        const handlePerPageChange = (e) => {
          setNewPerPage(Number(e.target.value)); // Update newPerPage state with the input value
        };
      
        const handleApplyPerPage = () => {
          setPerPage(newPerPage); // Apply the new perPage value
        };
  return (
    <div>
      <form>
        <label>Roles por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button> {/* Apply button */}
      </form>
      <div className='table-container'>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Permisos</th>
              {userRole === 1 ? (
                  <th><a href='https://web.sunger.xdn.com.mx/role/create'><button>Registrar rol</button></a></th>
              ) : (
              <p></p>
              )}
            </tr>
            {currentPageRoles.map(role => (
              <tr key={role.id_rol}>
                <td>{role.id_rol}</td>
                <td>{role.nombre_rol}</td>
                <td>{role.permisos}</td>
                {userRole === 1 ? (
                  <td className="action-buttons"><Link to={`/role/edit/${role.id_rol}`}><button>Editar</button></Link>
                  <button onClick={() => handleDelete(role.id_rol)}>Eliminar</button></td>
                  ) : (
                      <p></p>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(roles.length / perPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  )
}
