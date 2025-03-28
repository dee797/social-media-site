import { Link } from "react-router";
import { useState } from "react";

import { ReplyModal } from "./ReplyModal";
import { QuoteRepostModal } from "./QuoteRepostModal";
import { LikeButton } from "./LikeButton";
import { RepostButton } from "./RepostButton";


const findDisplayTime = (dateString) => {
    let displayTime;

    const now = new Date().getTime() / 1000;
    const timePostCreated = (new Date(dateString)).getTime() / 1000;
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
        displayTime = (new Date(dateString)).toLocaleDateString();
    }

    return displayTime;
}



const Post = ({currentUser, setCurrentUser, token, setShouldUpdateUser, setError, postData}) => {
    const [replyModalShow, setReplyModalShow] = useState(false);
    const [showChooseRepostType, setShowChooseRepostType] = useState(false);
    const [showQuoteRepost, setShowQuoteRepost] = useState(false);
    

    let displayTimeQuote;
    const displayTime = findDisplayTime(postData.date_created);    


    if (postData.quote_parent?.length) {
        displayTimeQuote = findDisplayTime(postData.quote_parent[0].parent_post.date_created);
    }


    return (
        <pre className="postListItem">
            <Link to={`/post/${postData.post_id}`} replace style={{padding: "10px 10px 0px"}}>
                <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                    <img crossOrigin="anonymous" referrerPolicy="no-referrer" src={postData.author.profile_pic_url} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
                    <div>{postData.author.name}</div>
                    <div className="lightGray">{postData.author.handle}</div>
                    <div className="lightGray">&#8226;</div>
                    <div className="lightGray">{displayTime}</div>
                </div>
            </Link>

                {
                    postData.reply_parent?.length ? 
                    <div style={{textAlign: "left", padding: "10px 0px 10px 56px"}}>
                        Replying to <Link to={`/post/${postData.reply_parent[0].parent_post.post_id}`} replace style={{color: "royalblue"}}>{postData.reply_parent[0].parent_post.author.handle}</Link>
                    </div>
                    :
                    null
                }
            <Link to={`/post/${postData.post_id}`} replace style={{padding: "0px 10px 10px"}}>
                <p style={{textAlign: "left", paddingLeft: "46px", marginBottom: "0px"}}>{postData.content}</p>
            </Link>

            
            
            {
                postData.quote_parent?.length ? 
                    <Link to={`/post/${postData.quote_parent[0].parent_post.post_id}`} replace>
                        <div style={{padding: "15px", border: "1px solid rgb(220, 220, 220)", borderRadius: "5px", marginLeft: "56px", marginBottom: "10px", fontSize: "0.95rem"}}>
                            <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                                <img crossOrigin="anonymous" referrerPolicy="no-referrer" src={postData.quote_parent[0].parent_post.author.profile_pic_url} style={{width: "30px", height: "30px", borderRadius: "15px"}}/>
                                <div>{postData.quote_parent[0].parent_post.author.name}</div>
                                <div className="lightGray">{postData.quote_parent[0].parent_post.author.handle}</div>
                                <div className="lightGray">&#8226;</div>
                                <div className="lightGray">{displayTimeQuote}</div>
                            </div>
                            <p style={{textAlign: "left", paddingLeft: "40px", marginBottom: "0px"}}>{postData.quote_parent[0].parent_post.content}</p>
                        </div>
                    </Link>
                :
                    null
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
                        showQuoteRepost={showQuoteRepost}
                        setShowQuoteRepost={setShowQuoteRepost}
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

            <QuoteRepostModal 
                currentUserId={currentUser.userInfo.user_id}
                authorProfilePic={postData.author.profile_pic_url}
                authorName={postData.author.name}
                authorHandle={postData.author.handle}
                authorId={postData.author.user_id}
                postId={postData.post_id}
                postCreated={displayTime}
                postContent={postData.content}
                modalShow={showQuoteRepost}
                callback={() => setShowQuoteRepost(false)}
            />
        </pre>
    );
}

export {
    Post
}