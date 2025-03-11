import { useState } from 'react';
import { Navigate, useLocation, useOutletContext } from 'react-router';
import { useCheckUser } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

const Settings = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const location = useLocation();

    useCheckUser(token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, location);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo}/>)

    return (
        <>
            <p>Settings placeholder</p>
        </>
    );

}

export {
    Settings
}