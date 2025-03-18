import { useState } from 'react'
import { useOutletContext, Navigate } from 'react-router';
import { useFetchData } from '../helpers';

import { Post } from '../components/Post';

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

    if (navigateTo) return (<Navigate to={navigateTo} replace/>)

    return (
        <>
            {
                homeData.posts.length === 0 ?
                    <p>There are currently no posts to view</p>
                :
                    homeData.posts.map(post => {
                        return (
                            <Post postData={post} key={post.post_id}/>
                        );
                    })
            }
        </>
    );
}

export {
    Home
}