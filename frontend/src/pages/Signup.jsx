import { useState } from 'react';
import { useNavigate, useOutletContext, Navigate, useLocation, Link } from "react-router";
import { useCheckUser, handleInputChange, handleSubmitForm } from '../helpers';

import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

import Loader from "../components/Loader";
import ServerErrorPage from './ServerErrorPage';

const fetchSignup = async (setValidationError, setServerError, setLoading, formData, navigate) => {
    
    return fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: 'post',
        mode: "cors",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async res => {
        try {
            const resBody = await res.json();

            if (res.status === 400 && resBody.validationErrors) {
                return setValidationError(resBody.validationErrors);
            } else if (res.status > 400) {
                throw new Error("Server error");
            }

            if (resBody.signupSuccess) {
                navigate("/login");
            }

        } catch (err) {
            throw new Error(err);
        }
    })
    .catch(err => {
        console.error(err);
        setServerError(err);
    })
    .finally(() => {
        setLoading(false);
    });
}

const Signup = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [serverError, setServerError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useCheckUser(token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo, location);
       

    if (loading) return (<Loader />);

    if (serverError) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo}/>)

    return (
        <div className='formDiv'>
            <Form 
                method='post' 
                onSubmit={(event) => handleSubmitForm(event, setLoading, () => {
                    fetchSignup(setValidationError, setServerError, setLoading, formData, navigate);
                })}
                style={{width: "500px"}}
            >
                
                <h2>Create Account</h2>

                <p>Please note that your name and username will be visible to other users.</p>

                <Form.Group className='formGroup'>
                    <Form.Label>Name</Form.Label>

                    <Form.Control
                        name='name'
                        maxLength={25}
                        type='text'
                        value={formData.name}
                        onChange={(event) => handleInputChange(event, setFormData)}
                    />
                    {
                        validationError?.name ?
                        <Form.Text className='invalidInput'>{validationError.name.msg}</Form.Text> :
                        null
                    }
                </Form.Group>

                <Form.Group className='formGroup'>
                    <Form.Label>Username</Form.Label>

                    <Form.Control
                        name='username'
                        type='text'
                        value={formData.username}
                        maxLength={25}
                        onChange={(event) => handleInputChange(event, setFormData)}
                    />
                    {
                        validationError?.username ?
                        <Form.Text className='invalidInput'>{validationError.username.msg}</Form.Text> :
                        null
                    }
                </Form.Group>

                <Form.Group className='formGroup'>
                    <Form.Label>Password</Form.Label>

                    <Form.Control
                        name='password'
                        type="password"
                        value={formData.password}
                        onChange={(event) => handleInputChange(event, setFormData)}
                    />
                        <Form.Text>
                            Password must be at least 8 characters long, have at least 1 lowercase letter,
                            have at least 1 uppercase letter, have at least 1 number, and have at least 1
                            special character
                        </Form.Text>
                    {
                        validationError?.password ?
                        <Form.Text className='invalidInput'><br />{validationError.password.msg}</Form.Text> :
                        null
                    }
                </Form.Group>

                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        name='confirmPassword'
                        type='password'
                        value={formData.confirmPassword}
                        onChange={(event) => handleInputChange(event, setFormData)}
                    />
                    {
                        validationError?.confirmPassword ?
                        <Form.Text className='invalidInput'>{validationError.confirmPassword.msg}</Form.Text> :
                        null
                    }
                </Form.Group>

                <Button style={{marginTop: "30px"}} variant='primary' type='submit'>Submit</Button>            
            </Form>

            <p>Already have an account? Sign in <Link to="/login" className='navigate'>here</Link></p>
        </div>
    );
}

export {
    Signup,
    fetchSignup
}