import { Link } from "react-router";
import { useState } from "react";

import { ReplyModal } from "./ReplyModal";
import { LikeButton } from "./LikeButton";
import { RepostButton } from "./RepostButton";



const Post = ({currentUser, setCurrentUser, token, setShouldUpdateUser, setError, postData}) => {
    const [replyModalShow, setReplyModalShow] = useState(false);
    const [showChooseRepostType, setShowChooseRepostType] = useState(false);
    

    let displayTime;

    const now = new Date().getTime() / 1000;
    const timePostCreated = (new Date(postData.date_created)).getTime() / 1000;
    const timeSincePostCreated = now - timePostCreated;
    const minutes = timeSincePostCreated / 60;

    // m = minute, h = hour, d = day
    if (minutes < 1) {
        displayTime = '1m';
    } else if (minutes < 60) {
        displayTime = Math.floor(minutes) + 'm';
    } else if (minutes < 1440) {    //1440 = number of minutes in a day
        displayTime = Math.floor(minutes / 60) + 'h';
    } else if (minutes < 10080) {   //10080 = number of minutes in a week
        displayTime = Math.floor(minutes / 60 / 24) + 'd';
    } else {
        displayTime = (new Date(postData.date_created)).toLocaleDateString();
    }

    return (
        <pre className="postListItem">
            <Link to={`/post/${postData.post_id}`} replace style={{padding: "10px"}}>
                <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                    <img crossOrigin="anonymous" referrerPolicy="no-referrer" src={postData.author.profile_pic_url} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
                    <div>{postData.author.name}</div>
                    <div className="lightGray">{postData.author.handle}</div>
                    <div className="lightGray">&#8226;</div>
                    <div className="lightGray">{displayTime}</div>
                </div>
                <p style={{textAlign: "left", paddingLeft: "46px"}}>{postData.content}</p>
            </Link>
            {
                
                postData.quote_parent?.length !== 0 ? 
                    <div>
                        <p>{postData.quote_parent[0].parent_post.author.profile_pic_url}</p>
                        <p>{postData.quote_parent[0].parent_post.author.name}</p>
                        <p>{postData.quote_parent[0].parent_post.author.handle}</p>
                        <p>{postData.quote_parent[0].parent_post.date_created}</p>
                        <p>{postData.quote_parent[0].parent_post.content}</p>
                    </div>
                :
                    null
            }


            {
                postData.userReplies?.length !== 0
            }


            <div style={{display: "flex", justifyContent: "flex-start", paddingLeft: "56px", columnGap: "60px"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <div className="postIcons" onClick={() => setReplyModalShow(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-right" viewBox="0 0 16 16">
                        <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                        </svg>
                    </div>

                    {
                        postData.numReplies !== 0 ?
                        <div className="countPlaceholder">{postData.numReplies}</div> :
                        <div className="countPlaceholder" style={{paddingLeft: "30px"}}></div>
                    }
                </div>


                <div style={{display: "flex", alignItems: "center", padding: "0px 15px"}}>
                   <RepostButton 
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        token={token}
                        setShouldUpdateUser={setShouldUpdateUser}
                        setError={setError}
                        currentPostId={postData.post_id}
                        authorId={postData.author.user_id}
                        numReposts={postData.numReposts}
                        showChooseRepostType={showChooseRepostType}
                        setShowChooseRepostType={setShowChooseRepostType}
                   />
                </div>


                <div style={{display: "flex", alignItems: "center"}}>
                    <LikeButton 
                        currentUser={currentUser} 
                        setCurrentUser={setCurrentUser} 
                        setShouldUpdateUser={setShouldUpdateUser} 
                        token={token} 
                        setError={setError}
                        currentPostId={postData.post_id}
                        authorId={postData.author.user_id}
                        numLikes={postData.numLikes}
                    />
                </div>
            </div>

            <ReplyModal 
                currentUserId={currentUser.userInfo.user_id}
                authorProfilePic={postData.author.profile_pic_url}
                authorName={postData.author.name}
                authorHandle={postData.author.handle}
                authorId={postData.author.user_id}
                postId={postData.post_id}
                postCreated={displayTime}
                postContent={postData.content}
                modalShow={replyModalShow}
                callback={() => setReplyModalShow(false)}
            />
        </pre>
    );
}

export {
    Post
}