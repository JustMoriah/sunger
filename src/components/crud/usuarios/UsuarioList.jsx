import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

export default function UsuarioList() {
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario logueado
  const [pageNumber, setPageNumber] = useState(0); // Estado para almacenar el número de página actual
  const [perPage, setPerPage] = useState(10); // Número de usuarios por página
  const [newPerPage, setNewPerPage] = useState(perPage); // Estado temporal para el valor de "usuarios por página"
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles disponibles

  const id_usuario = sessionStorage.getItem('id'); // Obtener el ID del usuario logueado desde el sessionStorage

  // useEffect para cargar los datos de usuarios, rol del usuario logueado y roles disponibles
  useEffect(() => {
    // Obtener la lista de todos los usuarios
    axios.get('https://api1.sunger.xdn.com.mx/api/users/')
      .then(response => {
        // Formatear la fecha de nacimiento de los usuarios antes de mostrarla
        const formattedUsers = response.data.map(user => {
          const formattedDate = new Date(user.fn).toISOString().split('T')[0];
          return { ...user, fn: formattedDate };
        });
        setUsers(formattedUsers); // Almacenar los usuarios formateados
      })
      .catch(error => console.error(error));

    // Obtener los datos del usuario logueado
    axios.get(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`)
      .then(response => {
        const storedUser = response.data;
        if (storedUser) {
          setUserRole(storedUser.id_rol); // Establecer el rol del usuario logueado
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          window.location.href = 'https://web.sunger.xdn.com.mx/login'; // Redirigir a login si el usuario no existe
        } else {
          console.error('Ha ocurrido un error al obtener los datos del usuario:', error);
        }
      });

    // Obtener la lista de todos los roles disponibles
    axios.get("https://api1.sunger.xdn.com.mx/api/roles/")
      .then(response => setRoles(response.data)) // Almacenar los roles disponibles
      .catch(error => console.error(error));
  }, [id_usuario]);

  // Manejar el cambio de rol de un usuario
  const handleRoleChange = (id_usuario, newRole) => {
    // Verificar si el usuario tiene permiso para asignar el rol "Dueño"
    if (newRole === '1' && userRole !== 1) {
      alert('No tienes permiso para asignar el rol de "Dueño".');
      return;
    }

    // Actualizar el rol del usuario en el estado local
    const updatedUsers = users.map(user => {
      if (user.id_usuario === id_usuario) {
        return { ...user, id_rol: newRole };
      }
      return user;
    });

    setUsers(updatedUsers); // Actualizar los usuarios en el estado

    // Enviar la actualización del rol al servidor
    axios.put(`https://api1.sunger.xdn.com.mx/api/users/id/${id_usuario}`, { id_rol: newRole })
      .then(response => {
        alert('¡El rol ha sido actualizado exitosamente!');
      })
      .catch(error => {
        console.error('Error actualizando el rol:', error);
      });
  };

  // Manejar la eliminación de un usuario
  const handleDelete = (id) => {
    // Enviar la solicitud para eliminar al usuario
    axios.delete(`https://api1.sunger.xdn.com.mx/api/users/id/${id}`)
      .then(() => {
        // Eliminar al usuario del estado local y mostrar mensaje
        setUsers(users.filter(user => user.id_usuario !== id));
        alert('Usuario ha sido eliminado.');
        window.location.href = 'https://web.sunger.xdn.com.mx/user-manage'; // Redirigir a la lista de usuarios
      })
      .catch(error => console.error(error));
  };

  // Obtener los usuarios para la página actual
  const currentPageUsers = users.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  // Manejar el cambio de página en la paginación
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected); // Actualizar el número de página
  };

  // Manejar el cambio del número de usuarios por página
  const handlePerPageChange = (e) => {
    setNewPerPage(Number(e.target.value)); // Actualizar el valor temporal de usuarios por página
  };

  // Aplicar el nuevo valor de usuarios por página
  const handleApplyPerPage = () => {
    setPerPage(newPerPage); // Actualizar el número de usuarios por página
  };

  return (
    <div>
      <form>
        <label>Usuarios por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} /> {/* Campo para cambiar usuarios por página */}
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button> {/* Botón para aplicar el nuevo valor */}
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
              {/* Botón para registrar un nuevo usuario (solo visible si el rol es "Dueño") */}
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
                    onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)} // Manejar el cambio de rol
                  >
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <option key={role.id_rol} value={role.id_rol}>
                          {role.nombre_rol}
                        </option>
                      ))
                    ) : (
                      <option value="">Roles no encontrados</option> // Mensaje si no se encuentran roles
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

      {/* Paginación */}
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(users.length / perPage)} // Calcular el número total de páginas
        onPageChange={handlePageClick} // Manejar el cambio de página
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
