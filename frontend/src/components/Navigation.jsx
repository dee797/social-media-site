import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { fetchData } from '../fetchCalls';
import Loader from './Loader';
import ServerErrorPage from './ServerErrorPage';


const Navigation = ({ currentUser, setCurrentUser, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (token && currentUser) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.user_id}/notifications`;
            const expectedKey = 'notifications';
            fetchData(token, setCurrentUser, setNotifications, setError, setLoading, navigate, url, expectedKey);
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
    Navigation
}