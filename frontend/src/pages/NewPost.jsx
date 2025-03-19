import { useState } from 'react';
import { Navigate, useLocation, useOutletContext, Link } from 'react-router';
import { useCheckUser, postData, handleSubmitForm, handleInputChange } from '../helpers';

import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



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

    if (navigateTo) return (<Navigate to={navigateTo} replace/>)

    if (!postSuccess) {
        return (
            <div className='formDiv'>
                <Form 
                    method="post" 
                    onSubmit={(event) => {
                        handleSubmitForm(event, setLoading, () => {
                            const posturl = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/posts`;
                            const expectedKey = 'createPostSuccess';
                            postData(token, currentUser, setCurrentUser, formData, setPostSuccess, setValidationError, setError, setLoading, setNavigateTo, posturl, expectedKey);
                        });
                    }}
                    style={{width: "100%", padding: "40px"}}
                >
                    <h2>Create New Post</h2>
                    <>
                        {
                            validationError ? 
                            <p>{validationError.content.msg}</p> 
                            : null
                        }
                        <FloatingLabel
                            controlId='floatingTextarea'
                            label="What's happening?"
                            className='mb-3'
                        >
                            <Form.Control
                                as="textarea"
                                name='content'
                                onChange={(event) => {
                                    handleInputChange(event, setFormData);
                                }}
                                maxLength={500}
                                style={{height: "200px", whiteSpace: "pre-wrap"}}
                                placeholder=''
                            >
                            </Form.Control>
                        </FloatingLabel>
                    </>
                    
                    <Button style={{marginTop: "20px"}} variant='dark' type='submit'>Post</Button>
                </Form>
            </div>
        );
    } else {
        return (
            <>
                <h2 style={{paddingTop: "30px"}}>Successfully created post</h2>
                <Link to="/" replace>
                    <Button style={{marginTop: "30px", marginRight: "30px"}} variant='dark' type='button'>Home</Button>
                </Link>
                <Link to="/post" replace reloadDocument={true}>
                    <Button style={{marginTop: "30px"}} variant='dark' type='button'>Create another post</Button>
                </Link>
            </>
        )
    }
    
}

export {
    NewPost
}

