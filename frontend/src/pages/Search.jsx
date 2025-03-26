import { useState } from 'react';
import { Navigate, useOutletContext, useSearchParams } from 'react-router';
import { useFetchData } from '../helpers';
import { FollowUserSnippet } from '../components/FollowUserSnippet';

import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

const Search = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();
    const [query] = useSearchParams();

    const [searchData, setSearchData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const url = `${import.meta.env.VITE_BACKEND_URL}/search?handle=${encodeURIComponent(query.get("handle"))}`;
    useFetchData(token, currentUser, setCurrentUser, setSearchData, setError, setLoading, setNavigateTo, url, null, query);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    if (query.size === 0 || query.get("handle") === "") {
        return (
            <h2 style={{padding: "40px 40px 0px"}}>Try searching for a user</h2>
        );
    }

    return (
        <>
            <h2 style={{padding: "40px 40px 0px"}}>Search Results</h2>
            {
                searchData.length === 0 ? 
                <p>Couldn't find any users with a handle containing '{query.get("handle")}'</p> :
                <div style={{padding: "10px 100px"}}>
                    {
                        searchData.map(user => {
                            return <FollowUserSnippet user={user} key={user.user_id}/>
                        })
                    }
                </div>
            }
        </>
    );
}

export {
    Search,
}