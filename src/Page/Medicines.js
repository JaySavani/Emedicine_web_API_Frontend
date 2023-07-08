import { useState, useEffect } from "react";
import { setAleart } from "../store/actions/alert";
import { IoTrashSharp, IoAddCircleOutline } from "react-icons/io5";
import { TbCurrencyRupee } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import Moment from 'moment';
import { useNavigate } from "react-router-dom";


import axios from "axios";


const Medicines = () => {

    const [medicines, setMedicines] = useState([]);
    const [name, setName] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [expdate, setExpDate] = useState("");
    const [discount, setDiscount] = useState("");
    const [unitprice, setUnitPrice] = useState("");
    const [status, setStatus] = useState(true);
    const [imagename, setImagename] = useState("");
    const [imagesrc, setImagesrc] = useState("");
    const [imagefile, setImageFile] = useState(null);
    const navigate = useNavigate();



    const [validated, setValidated] = useState(false);
    const [add, setAdd] = useState(true);
    const [mid, setMid] = useState(-1);
    const [mdid, setMdid] = useState(-1);
    const [show, setShow] = useState(false);
    const [showd, setShowd] = useState(false);

    const dhandleClose = () => {
        setShowd(false);
        setName("");
        setMdid(-1);
    }
    const dhandleShow = () => setShowd(true);

    const showPreview = (e) => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (x) => {
                setImageFile(imageFile)
                setImagename(imageFile.name)
                setImagesrc(x.target.result)
            }
            reader.readAsDataURL(imageFile);
        }
        else {
            setImageFile("")
            setImagesrc("")
        }
    }

    const resetstate = () => {
        setMid(-1);
        setName("");
        setManufacturer("");
        setExpDate("");
        setDiscount("");
        setUnitPrice("");
        setStatus(true);
        setImagesrc("");
        setShow(false);
    };

    const handleKeyPress = (event) => {
        var ename = (event.target.name);
        const keyCode = event.keyCode || event.which;
        // Allow only digits
        const keyValue = String.fromCharCode(keyCode);
        const isDigit = /^[\d.]+$/.test(keyValue);
        if (!isDigit) {
            event.preventDefault();
        }
        else if (ename === "unitprice" && keyValue === '.' && unitprice.includes('.')) {
            // Prevent further decimal points once one is already present
            event.preventDefault();
        }
        else if (ename === "discount" && keyValue === '.' && discount.includes('.')) {
            event.preventDefault();
        }
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
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            const formData = new FormData()
            formData.append('Name', name)
            formData.append('Manufacturer', manufacturer)
            formData.append('Discount', discount)
            formData.append('UnitPrice', unitprice)
            formData.append('ExpDate', expdate)
            formData.append('Status', status)
            formData.append('ImageUrl', imagename)
            formData.append('ImageSrc', imagename)
            formData.append('ImageFile', imagefile)
            if (add) {

                addmedicine(formData);
                resetstate();
            }
            else {
                medicineeditsubmit(mid, formData);
                resetstate();
            }
        }

        setValidated(true);
    };

    useEffect(() => {
        (localStorage.getItem('user') != "admin") ? navigate("/login") :
            getMedicines();
    }, []);


    // get all medicine
    const getMedicines = async () => {
        try {
            const res = await axios({
                method: "GET",
                url: "https://localhost:44322/api/Medicines",
            });
            setMedicines(res.data);
        } catch (error) {
            setAleart(error.message, "error");
        }
    };

    // Post medicine
    const addmedicine = async (formData) => {
        console.log(formData);
        try {
            const res = await axios({
                method: "POST",
                data: formData,
                url: "https://localhost:44322/api/Medicines",
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAleart("Medicine Added Successfully", "success");
            getMedicines();
        } catch (error) {
            setAleart(error.message, "error");
        }
    };

    // get user with id  
    async function medicineedit(id) {
        try {
            const res = await axios({
                method: "GET",
                data: {
                    id,
                },
                url: "https://localhost:44322/api/Medicines/" + id,
            });
            const medicine = res.data;
            setMid(medicine.id);
            setName(medicine.name);
            setManufacturer(medicine.manufacturer);
            setExpDate(Moment(medicine.expDate).format('yyyy-MM-DD'));
            setDiscount(medicine.discount);
            setUnitPrice(medicine.unitPrice);
            setStatus(medicine.status);
            setImagesrc(medicine.imageSrc);
            setImagename(medicine.imageUrl);

        } catch (error) {
            setAleart(error.message, "error");
        }
    }

    // Put User with id
    async function medicineeditsubmit(id, formData) {
        try {
            formData.append("id", id);
            const res = await axios({
                method: "PUT",
                data:
                    formData,
                url: "https://localhost:44322/api/Medicines/" + id,
            });
            getMedicines();
            setAleart("Medicine Updated Successfully", "success");
        } catch (error) {
            setAleart(error.message, "error");
        }
    }

    // delete user
    async function medicinedelete(id) {
        try {
            const res = await axios({
                method: "DELETE",
                data: {
                    id,
                },
                url: "https://localhost:44322/api/Medicines/" + id,
            });
            getMedicines();
            setAleart("Medicine Deleted Successfully", "success");
        } catch (error) {
            setAleart(error.message, "error");
        }
    }

    return (
        <>
            <div>
                {/* <h2 className="text-center pt-5 pb-3">CRUD Opration on Medicines</h2> */}
                <h2 className="text-center pt-5 pb-3">Medicines</h2>
            </div>
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
                                &nbsp;Add Medicine
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
                                <th scope="col">Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Manufacturer</th>
                                <th scope="col">ExpDate</th>
                                <th scope="col">Discount</th>
                                <th scope="col">UnitPrice</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((medicine) => (
                                <tr key={medicines.indexOf(medicine) + 1}>
                                    <th scope="row">{medicines.indexOf(medicine) + 1}</th>
                                    <td><img src={medicine.imageSrc} style={{ width: '100px', height: '100px' }} /></td>
                                    <td>{medicine.name}</td>
                                    <td>{medicine.manufacturer}</td>
                                    <td>{Moment(medicine.expDate).format('DD-MM-YYYY')}</td>
                                    <td>{medicine.discount}%</td>
                                    <td>{medicine.unitPrice}<TbCurrencyRupee size={17} /></td>
                                    <td>{medicine.status ? "Available" : "Not Available"}</td>
                                    <td>
                                        <a
                                            href="#"
                                            onClick={() => {
                                                setAdd(false);
                                                handleShow();
                                                medicineedit(medicine.id);
                                            }}
                                        >
                                            <BsPencilSquare color="red" size="20px" />
                                        </a>
                                        &nbsp; | &nbsp;
                                        <a
                                            href="#"
                                            onClick={() => {
                                                dhandleShow()
                                                setMdid(medicine.id)
                                                setName(medicine.name)
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
                        <Modal.Title>{add ? "Add" : "Update"} Medicine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card mx-auto mb-3" style={{ width: "50%" }}>
                            <img src={imagesrc} className="card-img-top " />
                        </div>
                        <InputGroup hasValidation className="mb-1">
                            <Form.Control
                                type="File"
                                accept="image/*"
                                onChange={showPreview}
                                placeholder="File"
                                id="imgfile"
                                aria-describedby="inputGroupPrepend"
                                required={add}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Select One Image.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Label>Medicine Name</Form.Label>
                        <InputGroup hasValidation className="mb-1">
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Medicine Name"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter a Medicine Name.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Label>Manufacturer</Form.Label>
                        <InputGroup hasValidation className="mb-1">
                            <Form.Control
                                type="text"
                                value={manufacturer}
                                onChange={(e) => setManufacturer(e.target.value)}
                                placeholder="Manufacturer"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter a Manufacturer.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Label>UnitPrice</Form.Label>
                        <InputGroup hasValidation className="mb-2">
                            <Form.Control
                                type="text"
                                value={unitprice}
                                name="unitprice"
                                onChange={(e) => setUnitPrice(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="UnitPrice"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter a UnitPrice with decimal.
                            </Form.Control.Feedback>
                        </InputGroup>

                        <Form.Label>Discount</Form.Label>
                        <InputGroup hasValidation className="mb-2">
                            <Form.Control
                                type="text"
                                value={discount}
                                name="discount"
                                onChange={(e) => setDiscount(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Discount"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter a Discount.
                            </Form.Control.Feedback>
                        </InputGroup>

                        <Form.Label>ExpDate</Form.Label>
                        <InputGroup hasValidation className="mb-3">
                            <Form.Control
                                type="date"
                                value={expdate}
                                onChange={(e) => setExpDate(e.target.value)}
                                placeholder="ExpDate"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter a UnitPrice.
                            </Form.Control.Feedback>
                        </InputGroup>
                        {/* <Form.Label>Status</Form.Label> */}
                        <InputGroup hasValidation className="mb-2">
                            <Form.Check
                                type="switch"
                                checked={status}
                                onChange={(e) => setStatus(!status)}
                                label="Available"
                            />
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
                    Are you sure you want to delete {name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={dhandleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="danger" onClick={() => {
                        dhandleClose();
                        medicinedelete(mdid);

                    }} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Medicines;