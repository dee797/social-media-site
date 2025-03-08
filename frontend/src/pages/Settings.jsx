import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

const Settings = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // useFetchData instead of useCheckUser to verify user since useCheckUser does not navigate back to login
    const url = `${import.meta.env.VITE_BACKEND_URL}/users/login`;
    useFetchData(token, currentUser, setCurrentUser, setAuthenticated, setError, setLoading, navigate, url);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (authenticated) return (
        <>
            {currentUser}
        </>
    );

    return navigate("/login");
}

export {
    Settings
}