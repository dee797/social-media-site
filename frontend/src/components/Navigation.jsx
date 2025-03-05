import {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router';
import Loader from './Loader';
import ServerErrorPage from './ServerErrorPage';


const fetchNotifications = async (token, currentUser, setCurrentUser, setNotifications, setError, setLoading, navigate) => {

    return fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.user_id}/notifications`, {
        mode: "cors", 
        method: "get",
        headers: {
            "Authorization": `Bearer ${token}`
        }})
    .then(res => {
        if (res.status > 401) {
            throw new Error();
        }
        return res.json();
    })
    .then(res => {
        if (res.error || res.authenticated === false) {
            localStorage.clear();
            setCurrentUser(null);
            return navigate("/login");
        }

        if (res.notifications) {
            setNotifications(res.notifications);
        }
    })
    .catch(err => {
        setError(err);
    })
    .finally(() => {
        setLoading(false);
    });
}


const Navigation = ({ currentUser, setCurrentUser, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (token && currentUser) {
            fetchNotifications(token, currentUser, setCurrentUser, setNotifications, setError, setLoading, navigate);
        } else {
            setLoading(false);
            navigate("/login");
        }
    }, [location]);


    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    return (
        <>
        <p>{notifications}</p>
        </>
    )
}


export { 
    Navigation,
    fetchNotifications
}