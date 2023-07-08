import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { Context } from "./Context";


function Navbar() {

    const [islogin, setIslogin] = useContext(Context);
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");
    const [username, setUsername] = useState("");

    const handlelogout = () => {
        localStorage.clear();
        setIslogin(false);
    }

    useEffect(() => {
        (localStorage.getItem('token')) ? setUsername(localStorage.getItem('name')) : setUsername("");
        (localStorage.getItem('user') == 'admin') ? setUser("admin") : setUser("")
        setToken(localStorage.getItem('token'))
    }, [islogin, handlelogout])


    return (
        <>
            <nav className="navbar sticky-top navbar-dark bg-dark navbar-expand-lg bg-body-tertiary" >
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">EMedicine</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {(user) ?
                                <>
                                    <li className="nav-item">
                                        <Link to="/users" className="nav-link " aria-current="page" >Users</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/medicines" className="nav-link" aria-current="page" >Medicines</Link>
                                    </li>
                                </> : ""
                            }

                            <li className="nav-item">
                                <Link to="/addtocart" className="nav-link" aria-current="page" >Addtocart</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/login" className="nav-link" aria-current="page" >Login</Link>
                            </li> */}
                            {token ? <>
                                <li className="nav-item">
                                    <Link to="/login" onClick={() => { handlelogout() }} className="nav-link">Logout</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">{username}</Link>
                                </li>
                            </>
                                :
                                <Link to="/login" className="nav-link d-flex" aria-current="page" >Login</Link>
                            }
                            {/* <li className="nav-item">
                                {token ? <><li className="nav-item"><Link to="/login" onClick={() => { handlelogout() }} className="nav-link">Logout</Link></li><Link to="/" className="nav-link">{username}</Link></> : <Link to="/login" className="nav-link" aria-current="page" >Login</Link>}
                            </li> */}


                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="button">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    );
}

// function User() {

//     useEffect(() => {
//         const user = (localStorage.getItem("email"))
//         if (user) {
//             setUsername(user);
//         }
//     }, [username]);

//     return (
//         <li className="nav-item">
//             {username ? <Link to="/login" onClick={() => { localStorage.clear(); setUsername("") }} className="nav-link">Logout</Link> : <Link to="/login" className="nav-link" aria-current="page" >Login</Link>}
//         </li>

//     );
// }

export default Navbar;