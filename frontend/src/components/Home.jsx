import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import { fetchData } from '../fetchCalls';
import Loader from './Loader';
import ServerErrorPage from './ServerErrorPage';


const Home = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [homeData, setHomeData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (token && currentUser) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/home`;
            fetchData(token, setCurrentUser, setHomeData, setError, setLoading, navigate, url);
        } else {
            setLoading(false);
            navigate("/login");
        }
    }, []);

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