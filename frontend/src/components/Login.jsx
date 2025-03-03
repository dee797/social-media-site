import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

//setCurrentUser sets hook at App.jsx level
const Login = ({setCurrentUser}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [serverError, setServerError] = useState(null);

    const [authenticationError, setAuthenticationError] = useState(null);

    const [loading, setLoading] = useState(true);



    const handleChange = event => {
        const { name, value } = event.target;
        setFormData(data => ({...data, [name]: value}));
    }


    const handleSubmitLogin = event => {
        event.preventDefault();
        setLoading(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
            method: 'post',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(async res => {
            try {
                const resBody = await res.json();

                if (res.status === 400 && resBody.message) {
                    return setAuthenticationError(resBody.message);
                } else if (res.status > 400) {
                    throw new Error("Server error");
                }

                if (resBody.loginSuccess) {
                    localStorage.setItem('token', res.token);
                    setCurrentUser(res.current_user_id);
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


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
                method: "post",
                headers: new Headers({
                    "Authorization": `Bearer ${token}`
                })
            })
            .then(res => {
                if (res.status > 400) {
                    throw new Error("Server error");
                }
                return res.json();
            })
            .then(res => {
                if (res.authenticated) {
                    navigate("/");
                }
            })
            .catch(err => {
                setServerError(err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);
    
    if (serverError) return (<p className="h-screen w-screen text-center">A network error was encountered.</p>);

    return (
        <>
            <form onSubmit={handleSubmitLogin}>
                {
                    authenticationError
                        ? <p>{authenticationError}</p>
                        : null
                }
                {   
                    loading 
                        ? <div className="h-screen w-screen flex items-center justify-center"><div className="loader mx-auto"></div></div>
                        : 
                        <>
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

export { Login }
