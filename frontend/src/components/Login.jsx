import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { checkUser } from '../fetchCalls';
import Loader from "./Loader";
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
                localStorage.setItem('current_user_id', resBody.user.current_user_id);
                setCurrentUser(resBody.user);
                navigate("/");
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

    const navigate = useNavigate();


    const handleChange = event => {
        const { name, value } = event.target;
        setFormData(data => ({...data, [name]: value}));
    }


    const handleSubmitLogin = event => {
        event.preventDefault();
        setLoading(true);
        
        fetchLogin(setCurrentUser, setAuthenticationError, setServerError, setLoading, formData, navigate);
    }


    useEffect(() => {
        if (token && currentUser) {
            checkUser(token, setCurrentUser, setServerError, setLoading, navigate);
        } else {
            setLoading(false);
        }
    }, []);

        
    if (serverError) return (<ServerErrorPage />);

    return (
        <>
            <form onSubmit={handleSubmitLogin}>
                {   
                    loading 
                        ? <Loader />
                        :
                        <>
                        {
                            authenticationError
                                ? <p>{authenticationError}</p>
                                : null
                        }
                            <label>
                            Username
                            <input 
                                name='username'
                                value={formData.username}
                                onChange={handleChange}    
                            />
                            </label>
                            <label>
                            Password
                            <input 
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            </label>

                            <button>Submit</button>
                        </>
                }
            </form>
        </>
    )
}

export { Login, fetchLogin }
