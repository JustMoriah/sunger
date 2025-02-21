import React from 'react';
import axios from 'axios';
import NavBar from './NavBar';

export default function OwnerPage() {
  const id_user = sessionStorage.getItem("id");
  axios.get(`http://localhost:3001/api/users/id/${id_user}`)
    .then((response) => {
        const storedUser = response.data;
        if (storedUser) {
          if (storedUser.id_role_1 != 1) {
            window.location.href = "/home";
          }
        }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = "/login";
    } else {
        console.error("An error occurred while checking for the email:", error);
    }
    });
  return (
    <div>
      <NavBar/><br/><br/>
      <h1>Welcome, owner!</h1>
    </div>
  );
}
