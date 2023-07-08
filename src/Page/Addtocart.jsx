import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { setAleart } from "../store/actions/alert";
import axios from "axios";
import Moment from "moment";

const Medicine = ({
  id,
  name,
  imageSrc,
  manufacturer,
  expDate,
  discount,
  unitPrice,
  handleAddToCart,
}) => {
  return (
    <Card style={{ width: "16rem", margin: "1rem", marginLeft: "0rem" }}>
      <Card.Body>
        <Card.Title className="text-center">{name}</Card.Title>
        <img
          src={imageSrc}
          className="container-fluid"
          alt={name}
          height="150"
          width="150"
        />
        <Card.Subtitle className="mb-2 mt-2 text-muted">
          Manufacturer : {manufacturer}
          <br />
          Old Unitprice :{unitPrice}
          <br />
          Discount : {discount}%
          <br />
          Price: {(unitPrice - unitPrice * discount * 0.01).toFixed(2)}
          <br />
          ExpDate : {Moment(expDate).format("DD-MM-YYYY")}
        </Card.Subtitle>
        <Button
          variant="danger"
          style={{ marginLeft: "55px" }}
          onClick={() => handleAddToCart(id)}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

const Cart = ({
  cart,
  handleIncrement,
  handleDecrement,
  handleRemove,
  handlecheckout,
}) => {
  const total = cart.reduce(
    (total, item) =>
      total +
      (item.unitPrice - item.discount * item.unitPrice * 0.01) * item.quantity,
    0
  );

  return (
    <div>
      <h2 className="mt-3 pb-3">Cart</h2>
      {cart.length > 0 ? (
        <ListGroup>
          {cart.map((item) => (
            <ListGroup.Item key={item.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.name}</h5>
                  <p>
                    {(
                      item.unitPrice -
                      item.discount * item.unitPrice * 0.01
                    ).toFixed(2)}{" "}
                    per unit
                  </p>
                </div>
                <div>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleIncrement(item.id)}
                  >
                    +
                  </Button>{" "}
                  <Button variant="primary" size="sm" disabled>
                    {item.quantity}
                  </Button>{" "}
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleDecrement(item.id)}
                  >
                    -
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
          <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Total:</h5>
              <h5>{total.toFixed(2)}</h5>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handlecheckout(total.toFixed(2))}
            >
              checkout
            </button>
            {/* <Button variant="danger" size="sm" onClick={() => handlecheckout()}>
              Remove
            </Button> */}
          </ListGroup.Item>
        </ListGroup>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    getMedicines();
  }, []);

  const getMedicines = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios({
        method: "GET",
        url: "https://localhost:44322/api/Medicines",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the authorization header
        },
      });
      setMedicines(res.data);
    } catch (error) {
      setAleart(error.message, "error");
    }
  };

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const handlecheckout = async (total) => {
    console.log(cart);
    const userid = localStorage.getItem("userid");
    const formData = new FormData();
    formData.append("Cart", cart);
    formData.append("userid", userid);
    formData.append("Total", total);

    try {
      const res = await axios({
        method: "POST",
        url: "https://localhost:44322/api/Orders",
        data: formData,
      });
      // console.log(res);
      // console.log(res.data);
      // localStorage.setItem("cart", "");
      // setCart("");
      setAleart("order created successfully", "success");
    } catch (error) {
      setAleart(error.message, "error");
    }
  };

  const handleAddToCart = (id) => {
    const medicine = medicines.find((medicine) => medicine.id === id);
    const itemInCart = cart.find((item) => item.id === id);
    if (itemInCart) {
      itemInCart.quantity++;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleIncrement = (id) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      } else {
        return item;
      }
    });
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleDecrement = (id) => {
    const newCart = cart.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      } else {
        return item;
      }
    });
    setCart(newCart.filter((item) => item.quantity > 0));
    localStorage.setItem(
      "cart",
      JSON.stringify(newCart.filter((item) => item.quantity > 0))
    );
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="mt-3">Medicine List</h2>
          <Row>
            <div style={{ maxHeight: "85vh", overflowY: "scroll" }}>
              <Row xs={1} md={2} lg={2}>
                {medicines.map((medicine) =>
                  medicine.status ? (
                    <Col key={medicine.id}>
                      <Medicine
                        {...medicine}
                        handleAddToCart={handleAddToCart}
                      />
                    </Col>
                  ) : (
                    ""
                  )
                )}
              </Row>
            </div>
          </Row>
        </Col>
        <Col className="ms-5">
          <Cart
            cart={cart}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleRemove={handleRemove}
            handlecheckout={handlecheckout}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineList;
