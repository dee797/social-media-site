import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from './Loader';
import ServerErrorPage from '../pages/ServerErrorPage';


const Navigation = ({ currentUser, setCurrentUser, token }) => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.user_id}/notifications`;
    const expectedKey = 'notifications';
    useFetchData(token, currentUser, setCurrentUser, setNotifications, setError, setLoading, navigate, url, expectedKey, location);
       

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