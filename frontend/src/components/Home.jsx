import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import Loader from './Loader';
import ServerErrorPage from './ServerErrorPage';

const fetchHomeData = async (token, setCurrentUser, setHomeData, setError, setLoading, navigate) => {

    return fetch(`${import.meta.env.VITE_BACKEND_URL}/home`, {
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

        if (res.users && res.posts) {
            setHomeData({users: res.users, posts: res.posts});
        }
    })
    .catch(err => {
        setError(err);
    })
    .finally(() => {
        setLoading(false);
    });
}


const Home = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [homeData, setHomeData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (token && currentUser) {
            fetchHomeData(token, setCurrentUser, setHomeData, setError, setLoading, navigate);
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