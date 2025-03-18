import { useState } from 'react';
import { Navigate, useOutletContext, useSearchParams } from 'react-router';
import { useFetchData } from '../helpers';
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
    useFetchData(token, currentUser, setCurrentUser, setSearchData, setError, setLoading, setNavigateTo, url);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    if (query.size === 0 || query.get("handle") === "") {
        return (
            <p>Try searching for a user</p>
        );
    }

    return (
        <>
            <p>Search placeholder</p>
        </>
    );
}

export {
    Search,
}