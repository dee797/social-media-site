import { useState } from 'react';
import { Navigate, useOutletContext, useParams } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';
import ErrorPage from './404ErrorPage';

const ViewPost = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const params = useParams();
    const postId = parseInt(params.id);

    let currentUserID = currentUser && currentUser.user_id;
    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserID}/posts/${postId}` 
    useFetchData(token, currentUser, setCurrentUser, setPostData, setError, setLoading, setNavigateTo, url)


    if (loading) return (<Loader />);

    if (error && error.message === "404") {
        return (<ErrorPage />);
    } else if (error) {
        return (<ServerErrorPage />);
    }

    if (navigateTo) return (<Navigate to={navigateTo}/>)

    return (
        <>
            <p>Placeholder test</p>
        </>
    );
}

export {
    ViewPost
}