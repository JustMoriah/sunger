import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/users/")
        .then(response => setUsers(response.data))
        .catch(error => console.error(error));
  }, []);

  const handleRoleChange = (id_user, newRole) => {
    const updatedUsers = users.map(user => {
      if (user.id_user === id_user) {
        return { ...user, id_role_1: newRole };
      }
      return user;
    });
    setUsers(updatedUsers);

    axios.put(`http://localhost:3001/api/users/${id_user}`, { id_role_1: newRole })
      .then(response => {
        alert("¡El rol ha sido actualizado exitosamente!");
      })
      .catch(error => {
        console.error("Error updating role:", error);
      });
  };
  return (
    <div>
      <h1>Hello, admin world!</h1>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>E-mail</th>
            <th>Nombre(s)</th>
            <th>Apellido(s)</th>
            <th>Fecha de Nacimiento</th>
            <th>Rol</th>
          </tr>
          {users.map(user => (
            <tr key={user.id_user}>
              <td>{user.id_user}</td>
              <td>{user.email}</td>
              <td>{user.nme}</td>
              <td>{user.surnme}</td>
              <td>{user.brthdte}</td>
              <td>
                <select name='id_role_1' value={user.id_role_1} onChange={(e) => handleRoleChange(user.id_user, e.target.value)}>
                  <option value="1">Dueño</option>
                  <option value="2">Admin</option>
                  <option value="3">Usuario</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
