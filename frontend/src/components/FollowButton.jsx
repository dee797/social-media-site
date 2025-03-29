import { useState } from "react";
import { handleSubmitForm } from "../helpers";
import { useNavigate } from "react-router";

import { deleteData } from "../helpers";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

const fetchPostFollow = async (token, currentUser, setCurrentUser, setShouldUpdateUser, setIsFollowed, setError, setLoading, navigate, url) => {
    if (token && currentUser) {
        return fetch(url, {
            mode: "cors",
            method: "post",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(async res => {
            try {
                const resBody = await res.json();

                if (res.status === 401 && (resBody.error || resBody.authenticated === false)) {
                    navigate("/login", {replace: true});
                    localStorage.clear();
                    setCurrentUser(null);
                    return;
                }

                if (res.status > 401) {
                    throw new Error();
                }

                setIsFollowed(resBody["createFollowSuccess"]);
                setShouldUpdateUser(resBody);
    
            } catch (err) {
                throw new Error(err);
            }
        })            
        .catch(err => {
            setError(err);
        })
        .finally(() => {
            setLoading(false);
        });
    } else {
        setLoading(false);
        navigate("/signup", {replace: true});
    }
}


const FollowButton = ({currentUser, setCurrentUser, setShouldUpdateUser, token, setError, followedUserId}) => {
    const [loading, setLoading] = useState(false);
    const [isFollowed, setIsFollowed] = useState(currentUser.following.find((user) => user.followed_user.user_id === followedUserId));
    const navigate = useNavigate();
    
    if (loading) return (<Button disabled><Spinner size="sm" /></Button>); 

    return (
        <>
        {
            isFollowed ?
            <form
                method="delete"
                onSubmit={(event) => {
                    handleSubmitForm(event, setLoading, () => {
                        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/following/${followedUserId}`;
                        deleteData(token, currentUser, setCurrentUser, setShouldUpdateUser, setIsFollowed, null, setError, setLoading, navigate, url);
                    })
                }}
            >
                <Button type="submit" variant="danger">Unfollow</Button>
            </form>
            :
            <form
                method="post"
                onSubmit={(event) => {
                    handleSubmitForm(event, setLoading, () => {
                        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/following/${followedUserId}`;
                        fetchPostFollow(token, currentUser, setCurrentUser, setShouldUpdateUser, setIsFollowed, setError, setLoading, navigate, url);
                    })
                }}
            >
                <Button type="submit" variant="primary">Follow</Button>
            </form>
        }   

        </>
    );
}


export {
    FollowButton
}