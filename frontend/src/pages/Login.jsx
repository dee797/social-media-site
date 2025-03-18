import { useState } from 'react';
import { useOutletContext, Navigate, useNavigate, useLocation, Link } from "react-router";
import { useCheckUser, handleInputChange, handleSubmitForm } from '../helpers';

import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

import Loader from "../components/Loader";
import ServerErrorPage from './ServerErrorPage';


const fetchLogin = async (setCurrentUser, setAuthenticationError, setServerError, setLoading, formData, navigate) => {

    return fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: 'post',
        mode: "cors",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async res => {
        try {
            const resBody = await res.json();

            if (res.status === 401 && resBody.message) {
                return setAuthenticationError(resBody.message);
            } else if (res.status > 401) {
                throw new Error();
            }

            if (resBody.loginSuccess) {
                localStorage.setItem('token', resBody.token);
                localStorage.setItem('current_user_id', resBody.user.user_id);
                setCurrentUser(resBody.user);
                navigate("/", {replace: true});
            }

        } catch (err) {
            throw new Error(err);
        }
    })
    .catch(err => {
        setServerError(err);
    })
    .finally(() => {
        setLoading(false);
    });
}


const Login = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [serverError, setServerError] = useState(null);
    const [authenticationError, setAuthenticationError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();


    useCheckUser(token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo, location);

    
    if (serverError) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    if (loading) return (<Loader />);

    return (
        <div className='formDiv'>
            <Form 
                method='post' 
                onSubmit={(event) => handleSubmitForm(event, setLoading, () => {
                    fetchLogin(setCurrentUser, setAuthenticationError, setServerError, setLoading, formData, navigate);
                })}
                style={{width: "500px"}}
            >
                
            <h2>Login</h2>
            {
                authenticationError
                    ? <p className='invalidInput'>{authenticationError}</p>
                    : null
            }
                <Form.Group className='formGroup'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        name='username'
                        value={formData.username}
                        onChange={(event) => handleInputChange(event, setFormData)}
                    />
                </Form.Group>


                <Form.Group>
                    <Form.Label >Password</Form.Label>
                    <Form.Control
                        name='password'
                        value={formData.password}
                        type='password'
                        onChange={(event) => handleInputChange(event, setFormData)}
                    />
                </Form.Group>

                <Button style={{marginTop: "30px"}} variant='primary' type='submit'>Submit</Button>                
            </Form>

            <p>Don't have an account? Create one <Link className="navigate" to="/signup" replace>here</Link></p>
        </div>
    )
}

export { Login, fetchLogin }
