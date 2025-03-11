import { useState } from 'react';
import { useNavigate, useOutletContext, Navigate, useLocation } from "react-router-dom";
import { useCheckUser, handleInputChange, handleSubmitForm } from '../helpers';
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
        <>
            <form method='post' onSubmit={(event) => handleSubmitForm(event, setLoading, () => {
                fetchSignup(setValidationError, setServerError, setLoading, formData, navigate);
            })}>
                {   
                    loading ?
                        <Loader /> :
                        <>
                            <p>Please note that your name and username will be visible to other users.</p>

                            <label>
                            Name
                            <input 
                                name='name'
                                value={formData.name}
                                onChange={(event) => handleInputChange(event, setFormData)}    
                            />
                            </label>
                            {
                                validationError && validationError.name ?
                                <p>{validationError.name.msg}</p> :
                                null
                            }

                            <label>
                            Username
                            <input 
                                name='username'
                                value={formData.username}
                                onChange={(event) => handleInputChange(event, setFormData)}    
                            />
                            </label>
                            {
                                validationError && validationError.username ?
                                <p>{validationError.username.msg}</p> :
                                null
                            }

                            <label>
                            Password
                            <input 
                                name='password'
                                value={formData.password}
                                onChange={(event) => handleInputChange(event, setFormData)}
                            />
                            </label>
                            {
                                validationError && validationError.password ?
                                <p>{validationError.password.msg}</p> :
                                null
                            }

                            <label>
                            Confirm Password
                            <input 
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={(event) => handleInputChange(event, setFormData)}
                            />
                            </label>
                            {
                                validationError && validationError.confirmPassword ?
                                <p>{validationError.confirmPassword.msg}</p> :
                                null
                            }

                            <button>Submit</button>
                        </>
                }
            </form>
        </>
    );
}

export {
    Signup,
    fetchSignup
}