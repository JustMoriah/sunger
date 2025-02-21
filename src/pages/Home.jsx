import Login from "../components/Login";
import React from "react";
import axios from "axios";
import isologo from '../assets/isologo.png'

const Home = () => {
    const id_user = sessionStorage.getItem("id");
    const signout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    }
    axios.get(`http://localhost:3001/api/users/id/${id_user}`)
        .then((response) => {
            const storedUser = response.data;
            if (storedUser) {
                if (storedUser.id_role_1 == 1) {
                    return(
                        <table>
                            <tbody>
                                <tr>
                                    <td><a href="/home"><img src={isologo}/></a></td>
                                    <td style="width: 40%">&nbsp;</td>
                                    <td><a href="/home">Inicio</a></td>
                                    <td><a href="/admin">Admin</a></td>
                                    <td><a href="/owner">Dueño</a></td>
                                    <td><button onClick={signout}>Cerrar Sesion</button></td>
                                </tr>
                            </tbody>
                        </table>
                    );
                }
                else if (storedUser.id_role_1 == 2) {
                    return(
                        <table>
                            <tbody>
                                <tr>
                                    <td><a href="/home"><img src={isologo}/></a></td>
                                    <td style="width: 40%">&nbsp;</td>
                                    <td><a href="/home">Inicio</a></td>
                                    <td><a href="/admin">Admin</a></td>
                                    <td><button onClick={signout}>Cerrar Sesion</button></td>
                                </tr>
                            </tbody>
                        </table>
                    );
                }
                else if (storedUser.id_role_1 == 3) {
                    return(
                        <table>
                            <tbody>
                                <tr>
                                    <td><a href="/home"><img src={isologo}/></a></td>
                                    <td style="width: 40%">&nbsp;</td>
                                    <td><button onClick={signout}>Cerrar Sesion</button></td>
                                </tr>
                            </tbody>
                        </table>
                    );
                }
                else{
                    
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
            <Login/>
        </div>
    );
};

export default Home;