import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AdminPage from "./components/AdminPage";
import OwnerPage from "./components/OwnerPage";
import UserPage from "./components/UserPage";
import "./index.css";
import UsuarioForm from "./components/crud/usuarios/UsuarioForm";
import UsuarioEdit from "./components/crud/usuarios/UsuarioEdit";
import RoleForm from "./components/crud/roles/RoleForm";
import RoleEdit from "./components/crud/roles/RoleEdit";
import ChargerForm from "./components/crud/cargador/ChargerForm";
import ChargerEdit from "./components/crud/cargador/ChargerEdit";
import LoginForm from "./components/crud/logins/loginform";
import LoginEdit from "./components/crud/logins/loginedit";
import MaintenanceForm from "./components/crud/mantenimientos/MaintenanceForm";
import MaintenanceEdit from "./components/crud/mantenimientos/MaintenanceEdit";
import UserManage from "./components/owner_pages/Users";
import RoleManage from "./components/owner_pages/Roles";
import LoginHistory from "./components/owner_pages/Logins";
import ChargerManage from "./components/owner_pages/Chargers";
import MaintenanceManage from "./components/owner_pages/Maintenance";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/owner" element={<OwnerPage/>}/>
      <Route path="/admin" element={<AdminPage/>}/>
      <Route path="/home" element={<UserPage/>}/>
      <Route path="/user/create" element={<UsuarioForm/>}/>
      <Route path="/user/edit/:id" element={<UsuarioEdit/>}/>
      <Route path="/role/create" element={<RoleForm/>}/>
      <Route path="/role/edit/:id" element={<RoleEdit/>}/>
      <Route path="/charger/create" element={<ChargerForm/>}/>
      <Route path="/charger/edit/:id" element={<ChargerEdit/>}/>
      <Route path="/logins/create" element={<LoginForm/>}/>
      <Route path="/logins/edit/:id" element={<LoginEdit/>}/>
      <Route path="/maintenance/create" element={<MaintenanceForm/>}/>
      <Route path="/maintenance/edit/:id" element={<MaintenanceEdit/>}/>
      <Route path="/user-manage" element={<UserManage/>}/>
      <Route path="/role-manage" element={<RoleManage/>}/>
      <Route path="/maintenance" element={<MaintenanceManage/>}/>
      <Route path="/login-history" element={<LoginHistory/>}/>
      <Route path="/charger-manage" element={<ChargerManage/>}/>
    </Routes>
  </BrowserRouter>
);