import { useState } from 'react';
import { useLocation, Navigate } from 'react-router';
import { useFetchData, handleSubmitForm, putData } from '../helpers';

import { Notification } from './Notification';

import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";



const NotificationList = ({token, currentUser, setCurrentUser, setError, setUnreadNotifCount}) => {
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const location = useLocation();

    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser?.userInfo.user_id}/notifications`;
    const expectedKey = 'notifications';
    useFetchData(token, currentUser, setCurrentUser, setNotifications, setError, setLoading, setNavigateTo, url, expectedKey, location);

    if (loading) return (
        <div className="d-sm-flex w-100 align-items-sm-center justify-content-sm-center" style={{height: '100px'}}>
            <Spinner size='sm'/>
        </div>
    );

    if (navigateTo) return (<Navigate to={navigateTo}/>);

    if (notifications.length > 0) {
        let unReadNotifCount = 0;
        const notificationComponents = notifications.map(notification => {
            if (!notification.read_status) {
                unReadNotifCount += 1;
            }

            return (<Notification notification={notification} key={notification.notification_id}/>);
        })
            
        setUnreadNotifCount(unReadNotifCount);

        return (
            <>
                <Form 
                    method='post'
                    onSubmit={(event) => {
                        handleSubmitForm(event, setLoading, () => {
                            const url = `${import.meta.env.VITE_BACKEND_URL}/users/${testCurrentUserId}/notifications`;
                            putData(token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, url);
                        });
                    }}
                >
                    <Button type="submit">Mark all as read</Button>
                </Form>
                {notificationComponents}
            </>
        );
    }

    return (
        <NavDropdown.ItemText className='m-auto'>You currently have no notifications</NavDropdown.ItemText>
    );
}

export {
    NotificationList
}