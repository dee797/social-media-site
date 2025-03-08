import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { useCheckUser } from '../helpers';
import Loader from './Loader';
import ServerErrorPage from './ServerErrorPage';

const Settings = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useCheckUser(token, currentUser, setCurrentUser, setError, setLoading, navigate);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    return (
        <>
            
        </>
    );
}

export {
    Settings
}