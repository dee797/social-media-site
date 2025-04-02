import { useState } from 'react';
import { useOutletContext, Navigate, useNavigate, Link } from "react-router";
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
                localStorage.setItem('currentUserHandle', resBody.user.userInfo.handle);
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

    const [fieldType, setFieldType] = useState("password");

    const navigate = useNavigate();

    useCheckUser(token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo);

    
    if (serverError) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    if (loading) return (<Loader />);

    return (
        <div className='formDiv'>
            <div>
                <h1 style={{fontStyle: "italic", color: "royalblue"}}>Flitter</h1>
                <p>A social media app</p>
            </div>

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

                    <div style={{position: "relative"}}>
                        <Form.Control
                            id="password"
                            name='password'
                            value={formData.password}
                            type={fieldType}
                            onChange={(event) => handleInputChange(event, setFormData)}
                        />
                        <svg 
                            style={
                                fieldType === "password" ? 
                                {display: "none"} :
                                {display: "inline"}
                            } 
                            className="togglePasswordIcon" 
                            width="25" height="25" 
                            id="eyeClosed_password" 
                            onClick={() => setFieldType(oldType => {
                                if (oldType === "text") {
                                    return "password";
                                } else {
                                    return "text"
                                }
                            })} 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                        </svg>

                        <svg 
                            style={
                                fieldType === "text" ? 
                                {display: "none"} :
                                {display: "inline"}
                            }
                            className="togglePasswordIcon" 
                            width="25" 
                            height="25" 
                            id="eyeOpen_password" 
                            onClick={() => setFieldType(oldType => {
                                if (oldType === "text") {
                                    return "password";
                                } else {
                                    return "text"
                                }
                            })} 
                            viewBox="0 0 28 28" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path clipRule="evenodd" d="M17.7469 15.4149C17.9855 14.8742 18.1188 14.2724 18.1188 14.0016C18.1188 11.6544 16.2952 9.7513 14.046 9.7513C11.7969 9.7513 9.97332 11.6544 9.97332 14.0016C9.97332 16.3487 12.0097 17.8886 14.046 17.8886C15.3486 17.8886 16.508 17.2515 17.2517 16.2595C17.4466 16.0001 17.6137 15.7168 17.7469 15.4149ZM14.046 15.7635C14.5551 15.7635 15.0205 15.5684 15.3784 15.2457C15.81 14.8566 16 14.2807 16 14.0016C16 12.828 15.1716 11.8764 14.046 11.8764C12.9205 11.8764 12 12.8264 12 14C12 14.8104 12.9205 15.7635 14.046 15.7635Z" fill="#000000" fillRule="evenodd"></path><path clipRule="evenodd" d="M1.09212 14.2724C1.07621 14.2527 1.10803 14.2931 1.09212 14.2724C0.96764 14.1021 0.970773 13.8996 1.09268 13.7273C1.10161 13.7147 1.11071 13.7016 1.11993 13.6882C4.781 8.34319 9.32105 5.5 14.0142 5.5C18.7025 5.5 23.2385 8.33554 26.8956 13.6698C26.965 13.771 27 13.875 27 13.9995C27 14.1301 26.9593 14.2399 26.8863 14.3461C23.2302 19.6702 18.6982 22.5 14.0142 22.5C9.30912 22.5 4.75717 19.6433 1.09212 14.2724ZM3.93909 13.3525C3.6381 13.7267 3.6381 14.2722 3.93908 14.6465C7.07417 18.5443 10.6042 20.3749 14.0142 20.3749C17.4243 20.3749 20.9543 18.5443 24.0894 14.6465C24.3904 14.2722 24.3904 13.7267 24.0894 13.3525C20.9543 9.45475 17.4243 7.62513 14.0142 7.62513C10.6042 7.62513 7.07417 9.45475 3.93909 13.3525Z" fill="#000000" fillRule="evenodd"></path></g>
                        </svg>
                    </div>

                </Form.Group>

                <Button style={{marginTop: "30px"}} variant='primary' type='submit'>Submit</Button>                
            </Form>

            <p>Don't have an account? Create one <Link className="navigate" to="/signup">here</Link></p>
        </div>
    )
}

export { Login, fetchLogin }
