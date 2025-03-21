import { useState } from 'react';
import { Navigate, useLocation, useOutletContext, Link } from 'react-router';
import { useCheckUser, postData, handleSubmitForm, handleInputChange } from '../helpers';

import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const PostForm = ({setPostSuccess, setLoading, url, id, setModalShow=null}) => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [formData, setFormData] = useState({
        content: "",
    });

    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [navigateTo, setNavigateTo] = useState(null);
    

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    return (
        <Form
            id={id} 
            method="post" 
            onSubmit={(event) => {
                handleSubmitForm(event, setLoading, () => {
                    postData(token, currentUser, setCurrentUser, formData, setPostSuccess, setValidationError, setError, setLoading, setNavigateTo, url, setModalShow);
                });
            }}
            style={{width: "100%", padding: "20px 40px",}}
        >
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
            
        </Form>
    );
}



const NewPost = () => {
    const [currentUser, setCurrentUser, token] = useOutletContext();

    const [postSuccess, setPostSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const location = useLocation();
    const posturl = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser?.userInfo.user_id}/posts`;

    useCheckUser(token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, location);

    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    if (!postSuccess?.createPostSuccess) {
        return (
            <div className='formDiv' style={{rowGap: "0px", minHeight: "fit-content", alignItems: "flex-start"}}>
                <h2 style={{padding: "40px 40px 0px"}}>Create New Post</h2>
                <PostForm setPostSuccess={setPostSuccess} setLoading={setLoading} url={posturl} id="newPost"/>
                <Button form="newPost" style={{marginTop: "20px", marginLeft: "40px"}} variant='dark' type='submit'>Post</Button>
            </div>
        );
    } else {
        return (
            <>
                <h2 style={{paddingTop: "30px"}}>Successfully created post</h2>
                <Link to="/" replace>
                    <Button style={{marginTop: "30px", marginRight: "30px"}} variant='dark' type='button'>Home</Button>
                </Link>
                <Button style={{marginTop: "30px"}} variant='dark' type='button' onClick={() => setPostSuccess(false)}>Create another post</Button>
            </>
        )
    }
    
}

export {
    NewPost,
    PostForm
}

