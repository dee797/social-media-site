import { useState } from 'react'
import { useOutletContext, Navigate } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';


const Home = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [homeData, setHomeData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);


    const url = `${import.meta.env.VITE_BACKEND_URL}/home`;
    useFetchData(token, currentUser, setCurrentUser, setHomeData, setError, setLoading, setNavigateTo, url);


    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo}/>)

    return (
        <>
        <p>Home placeholder</p>
        </>
    );
}

export {
    Home
}