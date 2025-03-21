import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router';
import { handleSubmitForm, putData } from '../helpers';

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

    useEffect(() => {
        let goTo = "";
        if (window.location.pathname === "/signup" || window.location.pathname === "/login") {
            goTo = window.location.pathname;
        } else {
            goTo = "/signup";
        }

        if (token && currentUser) {
            fetch(url, {
                mode: "cors", 
                method: "get",
                headers: {
                    "Authorization": `Bearer ${token}`
                }})
            .then(res => {
                if (res.status === 404) {
                    throw new Error("404");
                }
                if (res.status > 401) {
                    throw new Error("Server error");
                }
                return res.json();
            })
            .then(res => {
                if (res.error || res.authenticated === false) {
                    setNavigateTo("/login");
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }
        
                setNotifications(res);
            })
            .catch(err => {
                console.error(err);
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
            setNavigateTo(goTo);
        }
    }, [location]);


    if (loading) return (
        <div className="d-sm-flex w-100 align-items-sm-center justify-content-sm-center" style={{height: '100px'}}>
            <Spinner size='sm'/>
        </div>
    );

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

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