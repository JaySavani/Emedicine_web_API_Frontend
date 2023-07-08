import React from "react";
import { Routes, Route } from "react-router-dom";
import Users from "./Page/Users"
import Medicines from "./Page/Medicines"
import Addtocart from "./Page/Addtocart"
import Home from "./Page/Home"
// import Login from "./Page/Login"
import Login from "./Page/LoginPage"

export default function Routers() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route exact path='/users' element={<Users />} />
            <Route exact path='/medicines' element={<Medicines />} />
            <Route exact path='/addtocart' element={<Addtocart />} />
            {/* <Route exact path='/login' element={<Login />} /> */}
            <Route exact path='/login' element={<Login />} />
        </Routes>
    )

}