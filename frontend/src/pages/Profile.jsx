import { useState } from 'react'
import { useOutletContext, Navigate, useParams } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';
import ErrorPage from './404ErrorPage';


const Profile = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const params = useParams();
    const userHandle = params.handle;

    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${userHandle}/profile`;
    useFetchData(token, currentUser, setCurrentUser, setProfileData, setError, setLoading, setNavigateTo, url);


    if (loading) return (<Loader />);

    if (error && error.message === "404") {
        return (<ErrorPage />);
    } else if (error) {
        return (<ServerErrorPage />);
    }
    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    return (
        <>
            <p>Profile placeholder</p>
        </>
    )

}

export {
    Profile
}