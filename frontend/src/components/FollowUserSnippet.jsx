import { Link } from "react-router";

const FollowUserSnippet = ({user}) => {
    return (
        <Link to={`/user/${user.handle.slice(1)}`} replace className="userListItem">
            <div style={{display: "flex", columnGap: "12px", alignItems: "center"}}>
                <img crossOrigin="anonymous" referrerPolicy="no-referrer" src={user.profile_pic_url} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
                <div>{user.name}</div>
                <div className="lightGray">{user.handle}</div>
            </div>
        </Link>
    );
}

export {
    FollowUserSnippet
}