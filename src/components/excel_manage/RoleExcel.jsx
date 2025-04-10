import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import the xlsx library

const RoleExcel = () => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(""); // For error notifications
  const [excelData, setExcelData] = useState([]); // Store the data from the uploaded Excel
  const [fileName, setFileName] = useState(""); // Store the file name

  // Handle file selection and parse the Excel file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setFileName(file.name);

      // Read the file using xlsx library
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON (table format)
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData); // Set the parsed data
      };

      reader.readAsArrayBuffer(file); // Read the file
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setMensaje("");
      setError("Selecciona un archivo Excel");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", archivo); // Ensure the field name matches "file" on the backend
  
    try {
      const response = await axios.post("https://api1.sunger.xdn.com.mx/api/role-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Ensure the response contains the correct data (including the status field)
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setExcelData(response.data.data); // Update excelData with the rows containing status field
        const { registrosInsertados, registrosDuplicados, registrosFaltantes } = response.data;
        
        setError(""); // Clear error message, if any
        setMensaje(`Registros insertados: ${registrosInsertados}, Duplicados: ${registrosDuplicados}, Registros con datos faltantes: ${registrosFaltantes}`);
      } else {
        setError("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Error al subir el archivo");
      setMensaje(""); // Clear success message
    }
  };  

  const getRowColor = (status) => {
    if (status === "Subido") return "Green";
    if (status === "Duplicado") return "Orange";
    if (status === "Datos faltantes") return "Red";
    return "";
  };
  

  return (
    <div>
      <h3>Subir archivo Excel</h3>

      {/* Show success or error messages */}
      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show the Excel content before uploading */}
      {excelData.length > 0 && (
        <div className='table-container'>
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
              {excelData.map((row, index) => (
                <tr
                  key={index}
                  style={{ color: getRowColor(row.status) }}
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

      {/* Form for uploading the Excel */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <button type="submit">Subir</button>
      </form>
      <p>Refresca pagina para ver cambios</p>
    </div>
  );
};

export default RoleExcel;
