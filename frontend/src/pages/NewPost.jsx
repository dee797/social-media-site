import { useState } from 'react';
import { Navigate, useLocation, useOutletContext } from 'react-router';
import { useCheckUser, postData, handleSubmitForm, handleInputChange } from '../helpers';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

const NewPost = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [formData, setFormData] = useState({
        content: "",
    });

    const [postSuccess, setPostSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const location = useLocation();


    useCheckUser(token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, location);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo}/>)

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
                            <textarea 
                                name='content' 
                                onChange={(event) => {
                                    handleInputChange(event, setFormData);
                                }}
                                maxLength={500}
                            >
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
    
}

export {
    NewPost
}
