import { useState } from 'react';
import { Navigate, useOutletContext, useParams } from 'react-router';
import { useFetchData } from '../helpers';
import { Post } from '../components/Post';

import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';
import ErrorPage from './404ErrorPage';


const ViewPost = () => {
    const [currentUser, setCurrentUser, token, setShouldUpdateUser] = useOutletContext();

    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const params = useParams();

    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser?.userInfo.user_id}/posts/${params.id}` 
    useFetchData(token, currentUser, setCurrentUser, setPostData, setError, setLoading, setNavigateTo, url, null, currentUser)


    if (loading) return (<Loader />);

    if (error?.message === "404") {
        return (<ErrorPage />);
    } else if (error) {
        return (<ServerErrorPage />);
    }

    if (navigateTo) return (<Navigate to={navigateTo} replace/>);


    const mainPostData = {
        content: postData.thread[0].content,
        author_id: postData.thread[0].author_id,
        date_created: postData.thread[0].date_created,
        post_id: postData.thread[0].post_id,
        numLikes: postData.thread[0].numLikes,
        numReplies: postData.thread[0].numReplies,
        numReposts: postData.thread[0].numReposts,
        
        author: {
            user_id: postData.thread[0].author.user_id,
            name: postData.thread[0].author.name,
            handle: postData.thread[0].author.handle,
            profile_pic_url: postData.thread[0].author.profile_pic_url
        },

        reply_parent: 
            postData.thread[0].replyParent ?
            [{
                parent_post: postData.thread[0].replyParent.parent_post
            }] : [],
        
        quote_parent:
            postData.thread[0].quoteParent ?
            [{
                parent_post: postData.thread[0].quoteParent.parent_post
            }] : []
    };


    return (
        <>
            <div style={{display: "flex", flexDirection: "column", width: "100%", padding: "0px 200px 10px"}}>
                <div style={{display: "flex", margin: "30px 10px 0px"}}>
                    <Post
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        token={token}
                        setShouldUpdateUser={setShouldUpdateUser}
                        setError={setError}
                        postData={mainPostData}
                        isRepost={false}
                    />
                </div>

                <hr />

                <div style={{display: "flex", flexDirection: "column", padding: "0px 60px"}}>
                {
                    postData.thread.length > 1 ?
                    postData.thread.slice(1).map(post => {
                        if (post.replyParent?.parent_post.post_id !== postData.thread[0].post_id) {
                            return;
                        } 
                        
                        return (<Post 
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                            token={token}
                            setShouldUpdateUser={setShouldUpdateUser}
                            setError={setError}
                            postData={post}
                            isRepost={false}
                            key={post.post_id}
                        />);
                    })
                    :
                    <div style={{padding: "20px "}}>This post doesn't have any replies</div>
                }
                </div>

            </div>
        </>
    );
}

export {
    ViewPost
}