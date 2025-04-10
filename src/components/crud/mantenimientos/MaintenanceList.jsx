import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

export default function MaintenanceList() {
  const [maintenance, setMaintenance] = useState([]);
  const id_usuario = sessionStorage.getItem("id");
  const [userRole, setUserRole] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [newPerPage, setNewPerPage] = useState(perPage);

    useEffect(() => {
        axios.get("https://api1.sunger.xdn.com.mx/api/maintenance/")
        .then(response => {
            const formattedMaintenance = response.data.map(maintenance => {
            const formattedDate = new Date(maintenance.fecha).toISOString().split('T')[0];
            return { ...maintenance, fecha: formattedDate };
            });
            setMaintenance(formattedMaintenance);
        })
        .catch(error => console.error(error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`https://api1.sunger.xdn.com.mx/api/maintenance/id/${id}`)
            .then(() => {setMaintenance(maintenance.filter(maintenance => maintenance.id_rol !== id))
              alert("Historial de mantenimiento ha sido eliminado.");
              window.location.href = "https://web.sunger.xdn.com.mx/maintenance";
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

        const currentPageMain = maintenance.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

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
        <label>Mantenimientos por página:&nbsp;</label>
        <input type="number" value={newPerPage} onChange={handlePerPageChange} />
        <button type="button" onClick={handleApplyPerPage}>Aplicar</button> {/* Apply button */}
      </form>
      <div className='table-container'>
        {userRole === 2 ? (
                <a href='https://web.sunger.xdn.com.mx/maintenance/create'><button>Registrar mantenimiento</button></a>
            ) : (
          <p></p>
        )}
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>ID Cargador</th>
              <th>ID Usaurio</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripcion</th>
              {userRole === 1 ? (
                  <th><a href='https://web.sunger.xdn.com.mx/maintenance/create'><button>Registrar mantenimiento</button></a></th>
              ) : (
              <p></p>
              )}
            </tr>
            {currentPageMain.map(maintenance => (
              <tr key={maintenance.id_historial}>
                <td>{maintenance.id_historial}</td>
                <td>{maintenance.id_cargador}</td>
                <td>{maintenance.id_usuario}</td>
                <td>{maintenance.fecha}</td>
                <td>{maintenance.tipo}</td>
                <td>{maintenance.descripcion}</td>
                {userRole === 1 ? (
                  <td className="action-buttons"><Link to={`/maintenance/edit/${maintenance.id_historial}`}><button>Editar</button></Link>
                  <button onClick={() => handleDelete(maintenance.id_historial)}>Eliminar</button></td>
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
        pageCount={Math.ceil(maintenance.length / perPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  )
}
