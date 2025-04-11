import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Importar la librería xlsx para manejar archivos Excel

const RoleExcel = () => {
  // Hooks de estado para gestionar el archivo, mensajes, errores y los datos del archivo Excel
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState(""); // Mensaje mostrado después de la carga
  const [error, setError] = useState(""); // Mensaje de error en la carga del archivo
  const [excelData, setExcelData] = useState([]); // Almacena los datos procesados del archivo Excel
  const [fileName, setFileName] = useState(""); // Almacena el nombre del archivo cargado

  // Manejar la selección del archivo y procesarlo cuando el usuario seleccione uno
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

    // Preparar los datos del formulario para enviar el archivo Excel
    const formData = new FormData();
    formData.append("file", archivo); // Adjuntar el archivo al formulario

    try {
      // Enviar los datos del formulario al servidor usando una solicitud POST con axios
      const response = await axios.post("https://api1.sunger.xdn.com.mx/api/role-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Si la respuesta es exitosa, actualizar el estado con los datos del archivo procesado
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setExcelData(response.data.data); // Actualizar con los datos procesados del servidor
        const { registrosInsertados, registrosDuplicados, registrosFaltantes } = response.data;
        
        setError(""); // Limpiar el mensaje de error
        // Mostrar mensaje de éxito con estadísticas sobre los registros procesados
        setMensaje(`Registros insertados: ${registrosInsertados}, Duplicados: ${registrosDuplicados}, Registros con datos faltantes: ${registrosFaltantes}`);
      } else {
        setError("Error en la respuesta del servidor");
      }
    } catch (error) {
      // Manejar errores durante la carga del archivo
      console.error("Error al subir el archivo:", error);
      setError("Error al subir el archivo");
      setMensaje(""); // Limpiar mensaje de éxito en caso de error
    }
  };

  // Función para colorear las filas según el estado (para distinguir visualmente los tipos de filas)
  const getRowColor = (status) => {
    if (status === "Subido") return "Green"; // Color verde para filas con estado "Subido"
    if (status === "Duplicado") return "Orange"; // Color naranja para filas con estado "Duplicado"
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
                <th>Nombre</th>
                <th>Permisos</th>
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
                  <td>{row.nombre_rol}</td>
                  <td>{row.permisos}</td>
                  <td>{row.status}</td>
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

export default RoleExcel;
