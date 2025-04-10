import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate';

const LoginList = () => {
  const [logins, setLogins] = useState([]);
  const id_usuario = sessionStorage.getItem("id");
  const [userRole, setUserRole] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [newPerPage, setNewPerPage] = useState(perPage);

  useEffect(() => {
    axios.get("https://api1.sunger.xdn.com.mx/api/logins/")
      .then(response => {
        setLogins(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los logins:", error);
        alert("Hubo un error al cargar los logins.");
      });
  }, []);

  const handleDelete = (id_log) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      axios.delete(`https://api1.sunger.xdn.com.mx/api/logins/id/${id_log}`)
        .then(() => {
          setLogins(logins.filter(login => login.id_log !== id_log));
        })
        .catch(error => {
          console.error("Error al eliminar el login:", error);
          alert("Hubo un error al eliminar el login.");
        });
    }
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

  const currentPageLogins = logins.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const handlePerPageChange = (e) => {
    setNewPerPage(Number(e.target.value));
  };

  const handleApplyPerPage = () => {
    setPerPage(newPerPage);
  };

  return (
    <div>
      <form>
        <label>Logins por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button> {/* Apply button */}
      </form>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Usuario</th>
              <th>Accion</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
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
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={Math.ceil(logins.length / perPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default LoginList;
