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

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/owner" element={<OwnerPage/>}/>
      <Route path="/admin" element={<AdminPage/>}/>
      <Route path="/home" element={<UserPage/>}/>
    </Routes>
  </BrowserRouter>
);