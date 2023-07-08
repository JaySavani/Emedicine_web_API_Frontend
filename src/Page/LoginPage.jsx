import { React, useState, useContext } from "react";
import { setAleart } from "../store/actions/alert";
import axios from "axios";
import { Context } from "./Context";

// import { Modal, Button, Form, InputGroup } from "react-bootstrap";

import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginComponent(props) {
  const [mode, setMode] = useState("login");
  function toggleMode() {
    const newMode = mode === "login" ? "signup" : "login";
    setMode(newMode);
  }

  return (
    <>
      <div className="login-bg">
        <div
          className={`form-block-wrapper form-block-wrapper--is-${mode}`}
        ></div>
        <section className={`form-block form-block--is-${mode}`}>
          <header className="form-block__header">
            <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
            <div className="form-block__toggle-block">
              <span>
                {mode === "login" ? "Don't" : "Already"} have an account? Click
                here &#8594;
              </span>
              <input
                className="logincheckbox"
                id="form-toggler"
                type="checkbox"
                onClick={toggleMode}
              />
              <label htmlFor="form-toggler"></label>
            </div>
          </header>
          <LoginForm mode={mode} />
        </section>
      </div>
    </>
  );
}

function LoginForm(props) {
  const [validated, setValidated] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [lemail, setLEmail] = useState("");
  const [lpassword, setLPassword] = useState("");

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [islogin, setIslogin] = useContext(Context);

  function handleSubmit(event) {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (props.mode === "signup") {
        register();
      } else {
        login();
      }
    }

    setValidated(true);
  }
  // Post user
  const register = async () => {
    try {
      const res = await axios({
        method: "POST",
        data: {
          firstName: fname,
          lastName: lname,
          email: email,
          password: password,
          type: "user",
        },
        url: "https://localhost:44322/api/Auth/register",
      });
      const { token, user, name, userid } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      localStorage.setItem("name", name);
      localStorage.setItem("userid", userid);

      setIslogin(true);
      navigate("/addtocart");

      setAleart("User Register Successfully", "success");
    } catch (error) {
      setAleart(error.message, "error");
    }
  };

  const login = async () => {
    try {
      const res = await axios({
        method: "POST",
        data: {
          email: lemail,
          password: lpassword,
        },
        url: "https://localhost:44322/api/Auth/login",
      });
      const { token, user, name, userid } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      localStorage.setItem("name", name);
      localStorage.setItem("userid", userid);

      setIslogin(true);
      navigate("/addtocart");
      // if (token) {
      // }
      // for (var i = 0; i < localStorage.length; i++) {
      //   alert(localStorage.getItem(localStorage.key(i)));
      // }
      //   localStorage.clear();
      setAleart("User Login Successfully", "success");
    } catch (error) {
      setAleart("Invalid email or password", "error");
    }
  };

  function handleEmailChange(event) {
    const email = event.target.value;
    if (!email) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  }

  return (
    <form>
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <input
            className="form-group__input mb-2"
            type="text"
            id="email"
            placeholder="email"
            disabled={props.mode === "signup"}
            required
            value={lemail}
            onChange={(e) => setLEmail(e.target.value)}
          />
          <div style={{ color: "red" }}>{emailError}</div>
          <input
            className="form-group__input mb-2"
            type="password"
            id="password"
            placeholder="password"
            disabled={props.mode === "signup"}
            required
            value={lpassword}
            onChange={(e) => setLPassword(e.target.value)}
          />
        </div>
        <div className="form-group form-group--signup">
          <input
            className="form-group__input mb-2"
            type="text"
            id="firstname"
            placeholder="first name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            disabled={props.mode === "login"}
            required
          />

          <input
            className="form-group__input mb-2"
            type="text"
            id="lastname"
            placeholder="last name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            disabled={props.mode === "login"}
          />
          <input
            className="form-group__input mb-2"
            type="email"
            id="email"
            placeholder="email"
            disabled={props.mode === "login"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="form-group__input mb-2"
            type="password"
            id="createpassword"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={props.mode === "login"}
          />
          <input
            className="form-group__input mb-2"
            type="password"
            id="confirm password"
            placeholder="confirm password"
            disabled={props.mode === "login"}
          />
        </div>
      </div>
      <button
        className="button button--primary full-width"
        type="button"
        onClick={handleSubmit}
      >
        {props.mode === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
  );
}

export default LoginComponent;
