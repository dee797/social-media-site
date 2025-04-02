import { handleSubmitForm, putData } from '../helpers';

import { Notification } from './Notification';

import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";


const NotificationList = ({token, currentUser, setCurrentUser, setError, setNavigateTo, setLoading, notifLoading, notifications, setShouldUpdate}) => {

    if (notifLoading) return (
        <div className="d-sm-flex w-100 align-items-sm-center justify-content-sm-center" style={{height: '100px'}}>
            <Spinner size='sm'/>
        </div>
    );

    return (
        <>
            { 
                notifications.length > 0 ?
                <div style={{maxHeight: "200px", width: "270px", overflowY: "auto"}}>
                    <Form 
                        method='post'
                        onSubmit={(event) => {
                            handleSubmitForm(event, setLoading, () => {
                                const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/notifications`;
                                putData(token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, url, null, setShouldUpdate);
                            });
                        }}
                        style={{padding: "10px 30px", display: "flex"}}
                    >
                        <Button type="submit" style={{flex: 1}}>Mark all as read</Button>
                    </Form>

                    {
                        notifications.map(notification => {
                            return (
                                <Notification 
                                    token={token} 
                                    currentUser={currentUser} 
                                    setCurrentUser={setCurrentUser} 
                                    notification={notification} 
                                    setError={setError}
                                    setNavigateTo={setNavigateTo}
                                    setLoading={setLoading} 
                                    setShouldUpdate={setShouldUpdate}
                                    key={notification.notification_id}
                                />
                            );
                        }) 
                    }
                </div>
                :
                <NavDropdown.ItemText className='m-auto'>You currently have no notifications</NavDropdown.ItemText>
            }
        </>
    );
}

export {
    NotificationList
}