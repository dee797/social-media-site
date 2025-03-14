import { useState } from 'react';
import { useLocation, Navigate } from 'react-router';
import { useFetchData } from '../helpers';

import { Notification } from './Notification';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/esm/Spinner';


const NotificationList = ({token, currentUser, setCurrentUser, setError}) => {
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const location = useLocation();

    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.user_id}/notifications`;
    const expectedKey = 'notifications';
    useFetchData(token, currentUser, setCurrentUser, setNotifications, setError, setLoading, setNavigateTo, url, expectedKey, location);


    if (loading) return (
        <div className="d-sm-flex w-100 align-items-sm-center justify-content-sm-center" style={{height: '100px'}}>
            <Spinner size='sm'/>
        </div>
    );

    if (navigateTo) return (<Navigate to={navigateTo}/>);

    return ( 
        <>
            {
                notifications.length === 0 
                ? <NavDropdown.ItemText className='m-auto'>You currently have no notifications</NavDropdown.ItemText>
                : notifications.map(notification => {
                    return (
                        <Notification notification={notification} key={notification.notification_id}/>
                    );
                })
            }
        </>
    )  
}

export {
    NotificationList
}