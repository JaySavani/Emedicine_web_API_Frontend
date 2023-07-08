import './App.css';
import Navbar from './Page/navbar';
import Routers from './Routers';
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { Context } from "./Page/Context";



function App() {
  const [islogin, setIslogin] = useState(localStorage.getItem('token') ? true : false);

  return (
    <>
      <Context.Provider value={[islogin, setIslogin]}>
        <ToastContainer />
        <Navbar />
        <Routers />
      </Context.Provider>
    </>

  );
}

export default App;
