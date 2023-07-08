import { useState, useEffect } from "react";
import { setAleart } from "../store/actions/alert";
import { IoTrashSharp, IoAddCircleOutline } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [add, setAdd] = useState(true);
  const [uid, setUid] = useState(-1);
  const [showd, setShowd] = useState(false);
  const navigate = useNavigate();


  const dhandleClose = () => {
    setShowd(false);
    setFname("");
    setUid(-1);
  }
  const dhandleShow = () => setShowd(true);


  const [show, setShow] = useState(false);
  const resetstate = () => {
    setUid(-1);
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
    resetstate();
  };
  const handleShow = () => {
    setValidated(false);
    setShow(true);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else if (add) {
      adduser();
      resetstate();
    } else if (!add) {
      usereditsubmit(uid);
      resetstate();
    }
    setValidated(true);
  };

  useEffect(() => {
    (localStorage.getItem('user') != "admin") ? navigate("/login") :
      getUsers();
  }, []);

  // get all user
  const getUsers = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: "https://localhost:44322/api/Users",
      });
      setUsers(res.data);
    } catch (error) {
      setAleart(error.message, "error");
    }
  };

  // Post user
  const adduser = async () => {
    try {
      const token = localStorage.getItem('token');
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
        headers: {
          'Authorization': `Bearer ${token}` // Include the JWT token in the authorization header
        }
      });
      if (res) {
        setAleart("User Save Successfully", "success");
        getUsers();
      }
    } catch (error) {
      setAleart(error.message, "error");
    }
  };

  // get user with id
  async function useredit(id) {
    try {
      const res = await axios({
        method: "GET",
        data: {
          id,
        },
        url: "https://localhost:44322/api/Users/" + id,
      });
      const user = res.data;
      console.log(user);
      setUid(user.id);
      setFname(user.firstName);
      setLname(user.lastName);
      setEmail(user.email);
      setPassword(user.password);
    } catch (error) {
      setAleart(error.message, "error");
    }
  }

  // Put User with id
  async function usereditsubmit(id) {
    try {
      // const token = localStorage.getItem('token');

      const res = await axios({
        method: "PUT",
        data: {
          id: id,
          firstName: fname,
          lastName: lname,
          email: email,
          password: password,
          type: "user",
        },
        url: "https://localhost:44322/api/Users/" + id,
        // headers: {
        //   'Authorization': `Bearer ${token}` // Include the JWT token in the authorization header
        // }
      });
      getUsers();
      setAleart("User Updated Successfully", "success");
    } catch (error) {
      setAleart(error.message, "error");
    }
  }

  // delete user
  async function userdelete(id) {
    try {
      const res = await axios({
        method: "DELETE",
        data: {
          id,
        },
        url: "https://localhost:44322/api/Users/" + id,
      });
      getUsers();
      setAleart("User Deleted Successfully", "success");
    } catch (error) {
      setAleart(error.message, "error");
    }
  }

  return (
    <>
      {/* <h2 className="text-center pt-5 pb-3">CRUD Opration on Users</h2> */}
      <h2 className="text-center pt-5 pb-3">Users</h2>
      <div
        className="d-flex align-items-center justify-content-center"
      >
        <div className="container">
          <div className="d-flex justify-content-end me-1 mb-3">
            <div className="text-center">
              {/* <!-- Button trigger modal --> */}
              <Button
                variant="danger"
                onClick={() => {
                  handleShow();
                  setAdd(true);
                }}
              >
                <IoAddCircleOutline size="20px" className="pb-1" />
                &nbsp;Add User
              </Button>
            </div>
          </div>

          <table
            className="table table-striped table-hover "
            style={{ margin: "0 auto", width: "100" }}
          >
            <thead className="table-dark">
              <tr>
                <th scope="col">SR.No</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={users.indexOf(user) + 1}>
                  <th scope="row">{users.indexOf(user) + 1}</th>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>
                    <a
                      href="#"
                      onClick={() => {
                        setAdd(false);
                        handleShow();
                        useredit(user.id);
                      }}
                    >
                      <BsPencilSquare color="red" size="20px" />
                    </a>
                    &nbsp; | &nbsp;
                    <a
                      href="#"
                      onClick={() => {
                        dhandleShow()
                        setUid(user.id)
                        setFname(user.firstName)
                        // userdelete(user.id);
                      }}
                    >
                      <IoTrashSharp color="red" size="20px" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{add ? "Add" : "Update"} User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>First Name</Form.Label>
            <InputGroup hasValidation className="mb-1">
              <Form.Control
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder="Firstname"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter a First Name.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>Last Name</Form.Label>
            <InputGroup hasValidation className="mb-1">
              <Form.Control
                type="text"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                placeholder="Lastname"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter a Last Name.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation className="mb-1">
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter a Email.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation className="mb-2">
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter a Password.
              </Form.Control.Feedback>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="danger">
              {add ? "Add" : "Update"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* <!-- Modal End --> */}

      <Modal show={showd} onHide={dhandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {fname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={dhandleClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={() => {
            dhandleClose();
            userdelete(uid);

          }} >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Users;
