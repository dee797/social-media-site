import { useState } from 'react';
import { Navigate, useOutletContext, Link } from 'react-router';
import { useCheckUser, handleInputChange, handleSubmitForm, putData } from '../helpers';

import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';


const Settings = () => {
    const [currentUser, setCurrentUser, token, setShouldUpdateUser] = useOutletContext();

    const [formData, setFormData] = useState({
        name: currentUser?.userInfo.name,
        bio: currentUser?.userInfo.bio,
        profile_pic: null,
        banner_pic: null
    });

    const [putSuccess, setPutSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    useCheckUser(token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo);

    if (loading) return (<Loader />);

    if (serverError) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>)

    if (!putSuccess?.updateSuccess) {
        return (
            <div className='formDiv' style={{minHeight: "1px", paddingTop: "40px", paddingBottom: "40px"}}>
                <h2>Edit Profile</h2>
                <Form
                    method='put'
                    encType='multipart/form-data'
                    style={{width: "500px"}}
                    onSubmit={(event) => {
                        handleSubmitForm(event, setLoading, () => {
                            const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}`
                            putData(token, currentUser, setCurrentUser, setServerError, setLoading, setNavigateTo, url, formData, setPutSuccess, setValidationError, null, setFormData, setShouldUpdateUser)
                        })
                    }}
                >
                    {
                        validationError
                        && <p className='invalidInput'></p>
                    }
    
                    <Form.Group className='formGroup'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name='name'
                            maxLength={25}
                            value={formData.name}
                            type="text"
                            onChange={(event) => handleInputChange(event, setFormData)}
                        />
                        {
                            validationError?.name &&
                            <Form.Text className='invalidInput'>{validationError.name.msg}</Form.Text> 
                        }
                    </Form.Group>
    
                    <Form.Group className='formGroup'>
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            name='bio'
                            value={formData.bio}
                            as="textarea"
                            maxLength={500}
                            style={{height: "200px", whiteSpace: "pre-wrap"}}
                            onChange={(event) => handleInputChange(event, setFormData)}
                        />
                        {
                            validationError?.bio &&
                            <Form.Text className='invalidInput'>{validationError.bio.msg}</Form.Text> 
                        }
                    </Form.Group>
                    
                    <Form.Group className='formGroup'>
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control
                            name='profile_pic'
                            type='file'
                            accept='image/png, image/jpeg'
                            onChange={(event) => handleInputChange(event, setFormData)}
                        />
                        {
                            validationError?.profile_pic &&
                            <Form.Text className='invalidInput'>{validationError.profile_pic.msg}</Form.Text> 
                        }
                    </Form.Group>
    
                    <Form.Group className='formGroup'>
                        <Form.Label>Banner Picture</Form.Label>
                        <Form.Control
                            name='banner_pic'
                            type='file'
                            accept='image/png, image/jpeg'
                            onChange={(event) => handleInputChange(event, setFormData)}
                        />
                        {
                            validationError?.banner_pic &&
                            <Form.Text className='invalidInput'>{validationError.banner_pic.msg}</Form.Text> 
                        }
                    </Form.Group>
    
                    <Button style={{marginTop: "30px"}} variant='primary' type='submit'>Save Changes</Button>                
    
                </Form>
    
            </div>
        );
    }
    
    return (
        <>
            <h2 style={{paddingTop: "30px"}}>Successfully updated profile</h2>
            <Link to="/">
                <Button style={{marginTop: "30px", marginRight: "30px"}} variant='dark' type='button'>Home</Button>
            </Link>
            <Link to={`/user/${currentUser.userInfo.handle.slice(1)}`}>
                <Button style={{marginTop: "30px"}} variant='dark' type='button'>Profile</Button>
            </Link>
        </>
    );
}

export {
    Settings
}