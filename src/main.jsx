// Importamos las librerías y componentes necesarios
import React from "react"; // Importa React para poder trabajar con JSX
import ReactDOM from "react-dom/client"; // Importa la función necesaria para renderizar la app
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Rutas de la aplicación con react-router-dom
import Home from "./pages/Home"; // Página principal
import Login from "./components/Login"; // Página de login
import SignUp from "./components/SignUp"; // Página de registro
import AdminPage from "./components/AdminPage"; // Página de administrador
import OwnerPage from "./components/OwnerPage"; // Página del propietario
import UserPage from "./components/UserPage"; // Página de usuario normal
import "./index.css"; // Estilos globales
import UsuarioForm from "./components/crud/usuarios/UsuarioForm"; // Formulario para crear usuarios
import UsuarioEdit from "./components/crud/usuarios/UsuarioEdit"; // Formulario para editar usuarios
import RoleForm from "./components/crud/roles/RoleForm"; // Formulario para crear roles
import RoleEdit from "./components/crud/roles/RoleEdit"; // Formulario para editar roles
import ChargerForm from "./components/crud/cargador/ChargerForm"; // Formulario para crear cargadores
import ChargerEdit from "./components/crud/cargador/ChargerEdit"; // Formulario para editar cargadores
import LoginForm from "./components/crud/logins/loginform"; // Formulario para crear logins
import LoginEdit from "./components/crud/logins/loginedit"; // Formulario para editar logins
import MaintenanceForm from "./components/crud/mantenimientos/MaintenanceForm"; // Formulario para crear mantenimientos
import MaintenanceEdit from "./components/crud/mantenimientos/MaintenanceEdit"; // Formulario para editar mantenimientos
import UserManage from "./components/owner_pages/Users"; // Página para gestionar usuarios
import RoleManage from "./components/owner_pages/Roles"; // Página para gestionar roles
import LoginHistory from "./components/owner_pages/Logins"; // Página para gestionar historial de logins
import ChargerManage from "./components/owner_pages/Chargers"; // Página para gestionar cargadores
import MaintenanceManage from "./components/owner_pages/Maintenance"; // Página para gestionar mantenimientos

// Aquí estamos renderizando la aplicación en el contenedor con el id "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  // Usamos BrowserRouter para habilitar el enrutamiento en la aplicación
  <BrowserRouter>
    {/* Configuramos todas las rutas de la aplicación */}
    <Routes>
      <Route path="/" element={<Home />} /> {/* Ruta principal (Home) */}
      <Route path="/login" element={<Login/>}/> {/* Ruta para el login */}
      <Route path="/signup" element={<SignUp/>}/> {/* Ruta para el registro */}
      <Route path="/owner" element={<OwnerPage/>}/> {/* Ruta para la página del propietario */}
      <Route path="/admin" element={<AdminPage/>}/> {/* Ruta para la página del administrador */}
      <Route path="/home" element={<UserPage/>}/> {/* Ruta para la página de usuario */}
      <Route path="/user/create" element={<UsuarioForm/>}/> {/* Ruta para crear un usuario */}
      <Route path="/user/edit/:id" element={<UsuarioEdit/>}/> {/* Ruta para editar un usuario */}
      <Route path="/role/create" element={<RoleForm/>}/> {/* Ruta para crear un rol */}
      <Route path="/role/edit/:id" element={<RoleEdit/>}/> {/* Ruta para editar un rol */}
      <Route path="/charger/create" element={<ChargerForm/>}/> {/* Ruta para crear un cargador */}
      <Route path="/charger/edit/:id" element={<ChargerEdit/>}/> {/* Ruta para editar un cargador */}
      <Route path="/logins/create" element={<LoginForm/>}/> {/* Ruta para crear un login */}
      <Route path="/logins/edit/:id" element={<LoginEdit/>}/> {/* Ruta para editar un login */}
      <Route path="/maintenance/create" element={<MaintenanceForm/>}/> {/* Ruta para crear un mantenimiento */}
      <Route path="/maintenance/edit/:id" element={<MaintenanceEdit/>}/> {/* Ruta para editar un mantenimiento */}
      <Route path="/user-manage" element={<UserManage/>}/> {/* Ruta para gestionar usuarios */}
      <Route path="/role-manage" element={<RoleManage/>}/> {/* Ruta para gestionar roles */}
      <Route path="/maintenance" element={<MaintenanceManage/>}/> {/* Ruta para gestionar mantenimientos */}
      <Route path="/login-history" element={<LoginHistory/>}/> {/* Ruta para gestionar historial de logins */}
      <Route path="/charger-manage" element={<ChargerManage/>}/> {/* Ruta para gestionar cargadores */}
    </Routes>
  </BrowserRouter>
);
