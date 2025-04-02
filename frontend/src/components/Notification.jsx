import { Link } from "react-router";
import { handleSubmitForm, putData } from "../helpers";

const Notification = ({token, currentUser, setCurrentUser, notification, setError, setNavigateTo, setLoading, setShouldUpdate}) => {
    return (
        <Link 
            to={notification.source_url} 
            replace 
            onClick={(event => {
                if (!notification.read_status) {
                    document.getElementById(`${notification.notification_id}`).submit();
                }
            })}
        >
            
            <form
                method="put"
                id={`${notification.notification_id}`}
                onSubmit={event => {
                    handleSubmitForm(event, setLoading, () => {
                        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/notifications/${notification.notification_id}`;
                        putData(token, currentUser, setCurrentUser, setError, setLoading, setNavigateTo, url, null, setShouldUpdate)
                    });
                }}
            >
                <div style={{display: "flex", padding: "10px"}}>
                    {
                        !notification.read_status ?
                        <div style={{color: "royalblue", width: "20px", paddingTop: "3px", fontSize: "25px", maxHeight: "24px", display: "flex", alignItems: "center"}}>&#8226;</div>
                        :
                        <div style={{minHeight: "1px", paddingLeft: "20px"}}></div>
                    }

                    {
                        notification.type.type === "like" ?
                        <div>{notification.sender.name} liked your post</div>
                        : notification.type.type === "follow" ?
                        <div>{notification.sender.name} followed you</div>
                        : notification.type.type === "repost" ?
                        <div>{notification.sender.name} reposted your post</div>
                        : notification.type.type === "reply" ?
                        <div>{notification.sender.name} replied to your post</div>
                        :
                        null
                    }
                </div>
            </form>
        </Link>
    )
}

export {
    Notification
}