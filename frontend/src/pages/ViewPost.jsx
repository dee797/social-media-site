import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useFetchData } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';
import ErrorPage from './404ErrorPage';

const ViewPost = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const params = useParams();
    const postId = parseInt(params.id);

    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.user_id}/posts/${postId}`;
    useFetchData(token, currentUser, setCurrentUser, setPostData, setError, setLoading, navigate, url)


    if (loading) return (<Loader />);

    if (error === "404") {
        return (<ErrorPage />);
    } else if (error) {
        return (<ServerErrorPage />);
    }

    return (
        <>
            {postData}
        </>
    );
}

export {
    ViewPost
}