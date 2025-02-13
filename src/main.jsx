import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<LogIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
  </BrowserRouter>
);