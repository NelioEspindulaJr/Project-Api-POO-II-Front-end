import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

import './ModalLogin.css'
import { Alert, Button } from '@mui/material';

const ModalLogin = ({ isOpen, onClose, setIsLogged, isLogged }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [registerFirstName, setRegisterFirstName] = useState('')
    const [registerLastName, setRegisterlastName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [isRegistering, setIsRegistering] = useState(false);

    const height = isLogged ? '12.5rem' : '32.5rem'

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            height: height,
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '0.8rem',

        },
    };


    const handleLogin = () => {
        if (email && password) {
            axios.post(`${process.env.REACT_APP_API_URL!}/Auth/login`, { email, password }).then((res: any) => {
                sessionStorage.setItem('token', JSON.stringify(res.data.token))
                sessionStorage.setItem('user', JSON.stringify(res.data.user))
                onClose()
                window.location.reload()

            }).catch((error) => {
                console.log(error)
            })
        } else {

        }
        // onClose();
    };

    const handleRegister = () => {
        if (registerFirstName && registerLastName && registerEmail && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(registerEmail) && registerPassword && registerConfirmPassword && registerPassword === registerConfirmPassword) {

            axios.post(`${process.env.REACT_APP_API_URL!}/Auth/register`, {
                firstName: registerFirstName,
                lastName: registerLastName,
                email: registerEmail,
                password: registerPassword,
                confirmPassword: registerConfirmPassword,
            }).then((response: any) => {
                console.log(response.data)

            }).catch((error) => {
                console.log(error)
            })
        }
    }

    const handleRegistering = () => {
        setIsRegistering(!isRegistering)
    }
    return (

        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-container py-5" style={customStyles}>
            <button className='close-modal' onClick={onClose}>X</button>
            {isLogged ? (
                <div className='d-flex justify-content-between align-items-center flex-column'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <h1>Log out</h1>

                    </div>
                    <span className='mb-3'>Do you really wanna sign out?</span>
                    <Button className="w-100" variant="outlined" color="error" onClick={() => {
                        sessionStorage.setItem('token', '{}')
                        sessionStorage.setItem('user', '{}')
                        window.location.reload()
                    }}>
                        Log out
                    </Button>
                </div>
            ) : (<div>
                <div className='d-flex justify-content-center align-items-center'>
                    <h1>{isRegistering ? 'Register' : 'Login'}</h1>
                </div>
                {<div className='d-flex w-100 justify-content-end align-items-center flex-column' style={{ height: '100%' }}>
                    <form className='d-flex justify-content-between flex-column' style={{ height: '100%' }}>
                        {isRegistering ? (
                            <div className='form-group'>
                                <div className='row'>
                                    <div className='col'>
                                        <label>First Name:</label>
                                        <input type="text" className="form-control" placeholder="First name" aria-label="First name" onChange={(e) => setRegisterFirstName(e.target.value)} />

                                    </div>

                                    <div className='col'>
                                        <label>Last Name:</label>
                                        <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" onChange={(e) => setRegisterlastName(e.target.value)} />

                                    </div>
                                </div>
                                <label>Email:</label>
                                <input type="text" value={email} onChange={(e) => setRegisterEmail(e.target.value)} className='form-control' />

                                <label>Password:</label>
                                <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className='form-control' />

                                <label>Confirm Password:</label>
                                <input type="password" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} className='form-control' />

                                {(!registerConfirmPassword || !registerEmail || !registerFirstName || !registerLastName || !registerPassword) && <Alert severity='error'>All fields are required!</Alert>}
                            </div>

                        ) : (<div>
                            <div className='form-group'>
                                <label>Email:</label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' />
                            </div>
                            <div className='form-group'>
                                <label>Password:</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' />
                            </div>
                            {(!email || !password) && <Alert severity='error'>Email and password are required!</Alert>}
                        </div>)}


                        <div>
                            <div className='submit w-100 d-flex justify-content-center'>
                                <button type="button" onClick={() => {
                                    isRegistering ? handleRegister() : handleLogin()
                                }} className='login-button'>
                                    {isRegistering ? 'Register' : 'Login'}
                                </button>
                            </div>
                            <p>
                                {isRegistering ? "Already have an account?" : "Doesn't have an account?"} <span className='register' onClick={handleRegistering}>{isRegistering ? 'Login' : 'Register'}</span>
                            </p>
                        </div>

                    </form>
                </div>}
            </div>)}



        </Modal>
    );
};

export default ModalLogin;
