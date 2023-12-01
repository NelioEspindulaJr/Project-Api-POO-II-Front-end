/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { ModalDialog } from "@mui/joy";
import SectionHeading from "./SectionHeading";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

import Box from '@mui/joy/Box';
import List, { ListProps } from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListDivider from '@mui/joy/ListDivider';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Typography from '@mui/joy/Typography';
import Switch from '@mui/joy/Switch';
import axios from "axios";
import { Button, Card, TextField } from "@mui/material";
import Swal from "sweetalert2";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    borderRadius: '10px',
    p: 3,
    boxShadow: 'lg',
};



export default function ModalPayment({
    handleOpen,
    handleClose,
    open,
    user,
    cartProducts,
    setCartProducts,
    setCartProductsWithAmount
}: any) {

    const [address, setAddress] = useState({})
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [complement, setComplement] = useState('');

    const [discount, setDiscount] = useState<Record<any, any>>({})
    const [paymentType, setPaymentType] = useState('')

    const pay = () => {
        const orderData = {
            userId: user.id,
            total: cartProducts.reduce((sum: any, item: any) => sum + item.price * item.onCartAmount, 0).toFixed(2),
            paymentType: paymentType,
            discountId: discount.id,
            status: 'pending',
        }

        axios.post(`${process.env.REACT_APP_API_URL!}/Order/pay`, { paymentInfo: { provider: 'neliopay' }, order: orderData, products: cartProducts }).then((res) => {
            setCartProducts([])
            setCartProductsWithAmount([])
            sessionStorage.setItem('products', '[]')
            handleClose()

            Swal.fire({
                animation: true,
                icon: 'success',
                title: 'Success!',
                text: 'Purchase made succesfully! Wait for delivery instructions'
            }).then(() => {
                window.location.reload()
            })
        }).catch((err) => {
            console.log(err)
            handleClose()
            Swal.fire({
                animation: true,
                icon: 'error',
                title: 'Ooops!',
                text: 'Something Went wrong :(',
            }).then(() => {
                handleOpen()
            })
        })



    }
    useEffect(() => {
        if (user && JSON.stringify(user) !== '{}') {
            axios.get(`${process.env.REACT_APP_API_URL!}/User/${user.id}`).then((res) => {
                setAddress(res.data.address)
            })
        }

    });

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={handleClose}
            sx={style}
        >
            <ModalDialog variant="soft" layout="fullscreen">
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <div>
                    <div>

                        <div className="container">
                            <div className="row justify-content-between">
                                <div className="col-lg-5">
                                    <div className="intro-excerpt">
                                        <h1>Billing details</h1>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="container">
                            <div className="row" >
                                <div className="col-md-6 mb-5 mb-md-0" style={{ gap: '16px' }}>
                                    <Card className="p-3 mb-4">
                                        <div className="form-group row">
                                            <div className="col-md-9">
                                                <label htmlFor="c_address" className="text-black">Address <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" id="c_address" name="c_address" placeholder="Street address" />
                                            </div>

                                            <div className="col-md-3">
                                                <label htmlFor="c_address" style={{ color: 'transparent' }}>Address</label>
                                                <input type="text" className="form-control" id="c_address_number" name="c_address_number" placeholder="Number" />
                                            </div>
                                        </div>

                                        <div className="form-group mt-3">
                                            <input type="text" className="form-control" placeholder="Apartment, suite, unit etc. (optional)" />
                                        </div>

                                        <div className="form-group row">
                                            <div className="col-md-6">
                                                <label htmlFor="c_state_country" className="text-black">Zip code<span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" id="c_state_country" name="c_state_country" />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="c_postal_zip" className="text-black">City<span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" id="c_postal_zip" name="c_postal_zip" />
                                            </div>
                                        </div>

                                        <div className="form-group row mb-5">
                                            <div className="col-md-6">
                                                <label htmlFor="c_state" className="text-black">State <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" id="c_state" name="c_state" />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="c_neighborhood" className="text-black">Neighborhood <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" id="c_neighborhood" name="c_neighborhood" />
                                            </div>
                                        </div>
                                    </Card>


                                    {/* <div className="row mb-5">
                                        <div className="col-md-12 d-flex flex-column">
                                            <Card className="p-3">
                                                <div className="container">
                                                    <div className="row">
                                                        <h2 className="h3 mb-3 text-black">Coupon Code</h2>
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="d-flex flex-column w-100">
                                                            <div className="row">
                                                                <div className="mb-3">
                                                                    <span>Enter your coupon code if you have one</span>
                                                                </div>
                                                                <div className="col-10">
                                                                    <input type="text" className="form-control me-2" id="c_code" placeholder="Coupon Code" aria-label="Coupon Code" aria-describedby="button-addon2" />
                                                                </div>

                                                                <div className="col-2">
                                                                    <Button variant="contained" color="primary">Apply</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div> */}
                                </div>

                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="p-3 p-lg-5 d-flex flex-column justify-content-between border bg-white">
                                                <div className="row">
                                                    <div className="col-2">

                                                    </div>
                                                    <div className="col-4 d-flex justify-content-center align-items-center">
                                                        <span className="">Product Item </span>
                                                    </div>

                                                    <div className="col-3 d-flex justify-content-center">
                                                        <span className="">Amount</span>
                                                    </div>

                                                    <div className="col-3 d-flex justify-content-center">
                                                        <span className="">Price</span>
                                                    </div>

                                                </div>
                                                <hr />
                                                {cartProducts && cartProducts.length > 0 ? cartProducts.map((product: any, index: any) => {
                                                    return (
                                                        <div key={index} className="container mb-3">
                                                            <div className="row">
                                                                <div className="col-2">
                                                                    <img src={product.image} style={{ aspectRatio: '1/1', objectFit: 'cover', width: '60px', height: 'auto' }} alt={`product-${product.name}`} />
                                                                </div>
                                                                <div className="col-10 d-flex justify-content-center align-items-center">
                                                                    <div className="container">
                                                                        <div className="row">
                                                                            <div className="col-6 d-flex justify-content-center align-items-center">
                                                                                <span className="">{product.category.name} - {product.name} </span>
                                                                            </div>

                                                                            <div className="col-3">
                                                                                <span className="">  x{product.onCartAmount}</span>
                                                                            </div>

                                                                            <div className="col-3">
                                                                                <span className=""> $ {product.price.toFixed(2)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            {index + 1 === cartProducts.length ? null : <hr />}
                                                        </div>)
                                                }) : (
                                                    null
                                                )}
                                                <hr />
                                                <div className="row">
                                                    <div className="col-2">

                                                    </div>
                                                    <div className="col-4 d-flex justify-content-center align-items-center">
                                                        <span className=""></span>
                                                    </div>

                                                    <div className="col-1 d-flex justify-content-end">
                                                        <span className=""> </span>
                                                    </div>

                                                    <div className="col-5 d-flex justify-content-end">
                                                        <span className="">
                                                            Total: {cartProducts && cartProducts.length > 0 ? `$ ${cartProducts.reduce((sum: any, item: any) => sum + item.price * item.onCartAmount, 0).toFixed(2)}` : `$ 0.00`}
                                                        </span>
                                                    </div>

                                                </div>


                                                <RadioGroup
                                                    aria-labelledby="example-payment-channel-label"
                                                    overlay
                                                    name="example-payment-channel"
                                                >
                                                    <List
                                                        component="div"
                                                        variant="outlined"
                                                        orientation={'vertical'}
                                                        sx={{
                                                            borderRadius: 'sm',
                                                            boxShadow: 'sm',
                                                        }}
                                                    >
                                                        {['Credit Card'].map((value, index) => (
                                                            <React.Fragment key={value}>
                                                                {index !== 0 && <ListDivider />}
                                                                <ListItem>
                                                                    <Radio id={value} value={value} label={value} onChange={(e) => setPaymentType(e.target.value)} />
                                                                </ListItem>
                                                            </React.Fragment>
                                                        ))}
                                                    </List>
                                                </RadioGroup>

                                                <div className="p-3 w-100 d-flex align-items-center justify-content-end">
                                                    <Button color="success" variant="contained" onClick={() => { pay() }}>Place Order</Button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>



                    </div>
                </div>

            </ModalDialog >
        </Modal >

    );
}

