import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

export default function UsuarioList() {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [newPerPage, setNewPerPage] = useState(perPage); // Temporary state for new perPage value
  const [roles, setRoles] = useState([]);

  const id_usuario = sessionStorage.getItem('id');

  useEffect(() => {
    // Fetch all users
    axios.get('https://api1.sunger.xdn.com.mx/api/users/')
      .then(response => {
        const formattedUsers = response.data.map(user => {
          const formattedDate = new Date(user.fn).toISOString().split('T')[0];
          return { ...user, fn: formattedDate };
        });
        setUsers(formattedUsers);
      })
      .catch(error => console.error(error));

    // Fetch logged-in user data
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
      .then(response => {
        const storedUser = response.data;
        if (storedUser) {
          setUserRole(storedUser.id_rol);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          window.location.href = 'https://web.sunger.xdn.com.mx/login';
        } else {
          console.error('An error occurred while fetching user data:', error);
        }
      });

      //Fetch all roles
      axios.get("https://api1.sunger.xdn.com.mx/api/roles/")
        .then(response => setRoles(response.data))
        .catch(error => console.error(error));
  }, [id_usuario]);

  const handleRoleChange = (id_usuario, newRole) => {
    if (newRole === '1' && userRole !== 1) {
      alert('No tienes permiso para asignar el rol de "Dueño".');
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id_usuario === id_usuario) {
        return { ...user, id_rol: newRole };
      }
      return user;
    });

    setUsers(updatedUsers);

    axios.put(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`, { id_rol: newRole })
      .then(response => {
        alert('¡El rol ha sido actualizado exitosamente!');
      })
      .catch(error => {
        console.error('Error updating role:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`https://api1.sunger.xdn.com.mx/api/users/id/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id_usuario !== id));
        alert('Usuario ha sido eliminado.');
        window.location.href = 'https://web.sunger.xdn.com.mx/user-manage';
      })
      .catch(error => console.error(error));
  };

  const currentPageUsers = users.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

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
        <label>Usuarios por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button> {/* Apply button */}
      </form>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>E-mail</th>
              <th>Nombre(s)</th>
              <th>Apellido(s)</th>
              <th>Fecha de Nacimiento</th>
              <th>Genero</th>
              <th>Rol</th>
              <th>Activo</th>
              {userRole === 1 && (
                <th><Link to='/user/create'><button>Registrar usuario</button></Link></th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentPageUsers.map(user => (
              <tr key={user.id_usuario}>
                <td>{user.id_usuario}</td>
                <td>{user.correo}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.fn}</td>
                <td>{user.genero}</td>
                <td>
                  <select
                    name="id_rol"
                    value={user.id_rol}
                    onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                  >
                    {roles.length > 0 ? (
                              roles.map((role) => (
                                  <option key={role.id_rol} value={role.id_rol}>
                                      {role.nombre_rol}
                                  </option>
                              ))
                          ) : (
                              <option value="">Roles no encontrados</option>
                          )}
                  </select>
                </td>
                <td>{user.activo}</td>
                {userRole === 1 && (
                  <td className="action-buttons">
                    <Link to={`/user/edit/${user.id_usuario}`}><button>Editar</button></Link>
                    <button onClick={() => handleDelete(user.id_usuario)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(users.length / perPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
