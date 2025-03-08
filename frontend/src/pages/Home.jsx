import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';


const Home = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [homeData, setHomeData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const url = `${import.meta.env.VITE_BACKEND_URL}/home`;
    useFetchData(token, currentUser, setCurrentUser, setHomeData, setError, setLoading, navigate, url);


    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    return (
        <>
        <p>{homeData}</p>
        </>
    );
}

export {
    Home
}