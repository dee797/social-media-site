import { useState } from "react";
import { handleSubmitForm } from "../helpers";
import { useNavigate } from "react-router";

import { deleteData } from "../helpers";

const fetchPostLike = async (token, currentUser, setCurrentUser, setShouldUpdateUser, setError, setLoading, navigate, url) => {
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



const LikeButton = ({currentUser, setCurrentUser, setShouldUpdateUser, token, setError, currentPostId, authorId, numLikes}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (loading) return; 

    return (
        <>
        {
            currentUser.likedPosts.find(({post}) => post.post_id === currentPostId) ?
            <form
                method="delete"
                onSubmit={(event) => {
                    handleSubmitForm(event, setLoading, () => {
                        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/likes/${currentPostId}`;
                        deleteData(token, currentUser, setCurrentUser, setShouldUpdateUser, setError, setLoading, navigate, url);
                    })
                }}
            >
                <button className="likeButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#D90166" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>
                </button>
            </form>
            :
            <form
                method="post"
                onSubmit={(event) => {
                    handleSubmitForm(event, setLoading, () => {
                        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/likes/${currentPostId}/${authorId}`;
                        fetchPostLike(token, currentUser, setCurrentUser, setShouldUpdateUser, setError, setLoading, navigate, url);
                    })
                }}
            >
                <button className="likeButton">
                    <svg id="postNotLiked" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                    </svg>
                </button>
            </form>
        }   

        {
            numLikes !== 0 ?
            <div className="countPlaceholder">{numLikes}</div> :
            <div className="countPlaceholder" style={{paddingLeft: "40px"}}></div>
        }
        </>
    );
}


export {
    LikeButton
}