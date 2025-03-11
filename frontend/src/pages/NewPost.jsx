import { useState } from 'react';
import { Navigate, useOutletContext } from 'react-router';
import { useFetchData, postData, handleSubmitForm, handleInputChange } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

const NewPost = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [postSuccess, setPostSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);


    const url = `${import.meta.env.VITE_BACKEND_URL}/users/login`;
    useFetchData(token, currentUser, setCurrentUser, setAuthenticated, setError, setLoading, setNavigateTo, url);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo}/>)

    if (authenticated) {
        if (!postSuccess) {
            return (
                <>
                    <form method="post" onSubmit={(event) => {
                        handleSubmitForm(event, setLoading, () => {
                            const posturl = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.user_id}/posts`;
                            const expectedKey = 'createPostSuccess';
                            postData(token, currentUser, setCurrentUser, formData, setPostSuccess, setValidationError, setError, setLoading, setNavigateTo, posturl, expectedKey);
                        });
                    }}>
                        {
                            loading ?
                            <Loader /> : 
                            <>
                                {
                                    validationError ? 
                                    <p>{validationError.content.msg}</p> 
                                    : null
                                }
                                <textarea name='content' onChange={(event) => {
                                    handleInputChange(event, setFormData);
                                }}>
                                </textarea>
                            </>
                        }
                        
                        <button>Post</button>
                    </form>
                </>
            );
        } else {
            return (
                <>
                    <p>Successfully created post</p>
                    <button type='button'>Home</button>
                    <button type='button'>Create another post</button>
                </>
            )
        }
    } else {
        return <Navigate to="/signup"/>;
    }
}

export {
    NewPost
}
