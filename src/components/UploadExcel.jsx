// Importamos los hooks de React, axios para hacer peticiones HTTP, y la librería XLSX para trabajar con archivos Excel
import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Importamos la librería xlsx para poder leer y manejar archivos Excel

// Componente UploadExcel
const UploadExcel = () => {
  // Definimos los estados necesarios para manejar el archivo, mensajes, errores y datos del Excel
  const [archivo, setArchivo] = useState(null); // Archivo que se subirá
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito
  const [error, setError] = useState(""); // Mensaje de error
  const [excelData, setExcelData] = useState([]); // Almacenamos los datos del archivo Excel
  const [fileName, setFileName] = useState(""); // Almacenamos el nombre del archivo

  // Función que maneja la selección de archivos y la lectura del archivo Excel
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtenemos el archivo seleccionado
    if (file) {
      setArchivo(file); // Actualizamos el estado del archivo
      setFileName(file.name); // Almacenamos el nombre del archivo

      // Usamos el FileReader para leer el contenido del archivo
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result); // Obtenemos los datos binarios del archivo
        const workbook = XLSX.read(data, { type: "array" }); // Leemos el archivo Excel usando XLSX

        // Obtenemos los datos de la primera hoja del archivo
        const sheetName = workbook.SheetNames[0]; // Nombre de la primera hoja
        const worksheet = workbook.Sheets[sheetName]; // Obtenemos la hoja correspondiente

        // Convertimos los datos de la hoja a formato JSON (como una tabla)
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData); // Guardamos los datos del Excel en el estado
      };

      reader.readAsArrayBuffer(file); // Leemos el archivo como un ArrayBuffer
    }
  };

  // Función para manejar el envío del archivo a la API
  const handleUpload = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento predeterminado del formulario

    if (!archivo) {
      setMensaje(""); // Limpiamos cualquier mensaje previo
      setError("Selecciona un archivo Excel"); // Mostramos error si no se seleccionó un archivo
      return;
    }

    // Creamos un objeto FormData para enviar el archivo en la solicitud POST
    const formData = new FormData();
    formData.append("file", archivo); // Aseguramos que el campo se llama "file" en el backend

    try {
      // Enviamos el archivo a la API usando axios
      const response = await axios.post("https://api1.sunger.xdn.com.mx/api/subir-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Verificamos si la respuesta contiene los datos correctos
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setExcelData(response.data.data); // Actualizamos los datos con la respuesta de la API
        const { registrosInsertados, registrosDuplicados, registrosFaltantes } = response.data;
        
        setError(""); // Limpiamos cualquier mensaje de error
        setMensaje(`Registros insertados: ${registrosInsertados}, Duplicados: ${registrosDuplicados}, Registros con datos faltantes: ${registrosFaltantes}`);
      } else {
        setError("Error en la respuesta del servidor"); // Mostramos un error si la respuesta no es válida
      }
    } catch (error) {
      console.error("Upload error:", error); // Mostramos cualquier error en la consola
      setError("Error al subir el archivo"); // Mostramos un mensaje de error
      setMensaje(""); // Limpiamos el mensaje de éxito si ocurrió un error
    }
  };

  // Función para determinar el color de la fila según el estado
  const getRowColor = (status) => {
    if (status === "Subido") return "Green"; // Verde si el estado es "Subido"
    if (status === "Duplicado") return "Orange"; // Naranja si el estado es "Duplicado"
    if (status === "Datos faltantes") return "Red"; // Rojo si el estado es "Datos faltantes"
    return ""; // Si no tiene un estado válido, no se aplica color
  };

  return (
    <div>
      <h3>Subir archivo Excel</h3>

      {/* Mostrar mensajes de éxito o error */}
      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Mostrar el contenido del archivo Excel antes de enviarlo */}
      {excelData.length > 0 && (
        <div className='table-container'>
          <h4>Contenido del archivo {fileName}:</h4>
          <table border="1">
            <thead>
              <tr>
                <th>ID Rol</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha Nacimiento</th>
                <th>Género</th>
                <th>Correo</th>
                <th>Contraseña</th>
                <th>Activo</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {/* Mostrar los datos del Excel en una tabla */}
              {excelData.map((row, index) => (
                <tr
                  key={index}
                  style={{ color: getRowColor(row.status) }} // Colorear la fila según el estado
                >
                  <td>{row.id_rol}</td>
                  <td>{row.nombre}</td>
                  <td>{row.apellido}</td>
                  <td>{row.fn}</td>
                  <td>{row.genero}</td>
                  <td>{row.correo}</td>
                  <td>{row.contrasena}</td>
                  <td>{row.activo}</td>
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
          accept=".xlsx" // Solo aceptamos archivos .xlsx
          onChange={handleFileChange} // Llamamos a handleFileChange cuando el archivo cambia
        />
        <button type="submit">Subir</button>
      </form>
      <p>Refresca pagina para ver cambios</p>
    </div>
  );
};

export default UploadExcel;
