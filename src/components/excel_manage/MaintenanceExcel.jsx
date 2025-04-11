import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Importar la librería xlsx para manejar archivos Excel

const MaintenanceExcel = () => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito
  const [error, setError] = useState(""); // Mensaje de error
  const [excelData, setExcelData] = useState([]); // Almacenar los datos procesados del archivo Excel
  const [fileName, setFileName] = useState(""); // Almacenar el nombre del archivo cargado

  // Manejar la selección del archivo y procesarlo cuando el usuario selecciona uno
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file); // Almacenar el archivo seleccionado
      setFileName(file.name); // Almacenar el nombre del archivo

      // Usar FileReader para leer el archivo y procesarlo como un archivo Excel
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Obtener los datos de la primera hoja del archivo Excel
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir los datos de la hoja a formato JSON (tabla) y almacenarlos
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData); // Almacenar los datos procesados en el estado
      };

      reader.readAsArrayBuffer(file); // Leer el archivo como un buffer binario
    }
  };

  // Manejar la carga del archivo enviándolo al servidor
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo) {
      // Verificar si se ha seleccionado un archivo
      setMensaje("");
      setError("Selecciona un archivo Excel");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", archivo); // Adjuntar el archivo al formulario
  
    try {
      // Enviar los datos del formulario al servidor usando una solicitud POST con axios
      const response = await axios.post("https://api1.sunger.xdn.com.mx/api/maintenance-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Respuesta de la API:", response.data);
  
      // Verificar si la respuesta contiene los datos correctos (incluyendo el campo status)
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setExcelData(response.data.data); // Almacenar los datos procesados
        const { registrosInsertados, registrosFaltantes } = response.data;
        
        setError(""); // Limpiar el mensaje de error si lo había
        // Mostrar mensaje de éxito con la cantidad de registros procesados
        setMensaje(`Registros insertados: ${registrosInsertados}, Registros con datos faltantes: ${registrosFaltantes}`);
      } else {
        setError("Error en la respuesta del servidor");
      }
    } catch (error) {
      // Manejar errores durante la carga del archivo
      console.error("Error al subir el archivo:", error);
      setError("Error al subir el archivo");
      setMensaje(""); // Limpiar el mensaje de éxito en caso de error
    }
  };

  // Función para colorear las filas según el estado (para distinguir visualmente los tipos de filas)
  const getRowColor = (status) => {
    if (status === "Subido") return "Green"; // Color verde para filas con estado "Subido"
    if (status === "Datos faltantes") return "Red"; // Color rojo para filas con estado "Datos faltantes"
    return ""; // Sin color por defecto
  };

  return (
    <div>
      <h3>Subir archivo Excel</h3>

      {/* Mostrar los mensajes de éxito o error */}
      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Mostrar el contenido del archivo Excel antes de subirlo */}
      {excelData.length > 0 && (
        <div className="table-container">
          <h4>Contenido del archivo {fileName}:</h4>
          <table border="1">
            <thead>
              <tr>
                <th>ID Cargador</th>
                <th>ID Usuario</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Descripcion</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {/* Iterar sobre los datos del archivo Excel y mostrarlos en una tabla */}
              {excelData.map((row, index) => (
                <tr
                  key={index}
                  style={{ color: getRowColor(row.status) }} // Colorear la fila según el estado
                >
                  <td>{row.id_cargador}</td>
                  <td>{row.id_usuario}</td>
                  <td>{row.fecha}</td>
                  <td>{row.tipo}</td>
                  <td>{row.descripcion}</td>
                  <td>{row.status}</td> {/* Mostrar el estado */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulario para subir el archivo Excel */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange} // Activar la selección del archivo
        />
        <button type="submit">Subir</button>
      </form>
      <p>Refresca la página para ver cambios</p>
    </div>
  );
};

export default MaintenanceExcel;
