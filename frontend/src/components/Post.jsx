import { Link } from "react-router";
import { useState, useMemo } from "react";

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



const Post = ({currentUser, setCurrentUser, token, setShouldUpdateUser, setError, postData, isRepost, userHandle=null}) => {
    
    const [replyModalShow, setReplyModalShow] = useState(false);
    const [showChooseRepostType, setShowChooseRepostType] = useState(false);
    const [showQuoteRepost, setShowQuoteRepost] = useState(false);
    
    let found = false;
    if (currentUser.likedPosts.find(({post}) => post.post_id === postData.post_id)) found = true;

    const [isLikedPost, setIsLikedPost] = useState(found);
    const [likeCount, setLikeCount] = useState(postData.numLikes);


    let displayTimeQuote;
    const displayTime = findDisplayTime(postData.date_created);    


    if (postData.quote_parent?.length) {
        displayTimeQuote = findDisplayTime(postData.quote_parent[0].parent_post.date_created);
    }

    const currentUserProfilePic = useMemo(() => {
        return (<img crossOrigin="anonymous" referrerPolicy="no-referrer" src={postData.author.profile_pic_url} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
        );
    }, [postData.author.profile_pic_url]);

    const quoteProfilePic = useMemo(() => {
        if (postData.quote_parent?.length) return (<img crossOrigin="anonymous" referrerPolicy="no-referrer" src={postData.quote_parent[0].parent_post.author.profile_pic_url} style={{width: "30px", height: "30px", borderRadius: "15px"}}/>
        );
    }, postData.quote_parent?.length ? [postData.quote_parent[0].parent_post.author.profile_pic_url] : []);


    return (
        <pre className="postListItem">
            { 
                isRepost ?
                <div style={{color: "gray", textAlign: "left", display: "flex", alignItems: "center", columnGap: "5px"}}>
                    <svg fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
                    <path stroke="white" strokeWidth="1.2" d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path>
                    </svg>
                    {
                        userHandle === currentUser?.userInfo.handle.slice(1) ? 
                        <>You reposted</> :
                        <>{currentUser.userInfo.name} reposted</>
                    }
                </div> :
                null
            }

            <div style={{padding: "10px 10px 0px"}}>
                <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                    <Link to={`/user/${postData.author.handle.slice(1)}`} >
                        <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                        {currentUserProfilePic}
                        <div>{postData.author.name}</div>
                        <div className="lightGray">{postData.author.handle}</div>
                        </div>
                    </Link>
                    <div className="lightGray">&#8226;</div>
                    <div className="lightGray">{displayTime}</div>
                </div>
            </div>
                {
                    postData.reply_parent?.length ? 
                    <div style={{textAlign: "left", padding: "5px 0px 5px 56px"}}>
                        Replying to <Link to={`/post/${postData.reply_parent[0].parent_post.post_id}`} style={{color: "royalblue"}}>{postData.reply_parent[0].parent_post.author.handle}</Link>
                    </div>
                    :
                    null
                }
            <Link to={`/post/${postData.post_id}`} style={{padding: "0px 10px 10px"}}>
                <p style={{textAlign: "left", paddingLeft: "46px", marginBottom: "0px"}}>{postData.content}</p>
            </Link>

            
            {
                postData.quote_parent?.length ? 
                    <div style={{padding: "15px", border: "1px solid rgb(220, 220, 220)", borderRadius: "5px", marginLeft: "56px", marginBottom: "10px", fontSize: "0.95rem"}}>
                        <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                            <Link to={`/user/${postData.quote_parent[0].parent_post.author.handle.slice(1)}`}>
                                <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                                {quoteProfilePic}
                                <div>{postData.quote_parent[0].parent_post.author.name}</div>
                                <div className="lightGray">{postData.quote_parent[0].parent_post.author.handle}</div>
                                </div>
                            </Link>
                            <div className="lightGray">&#8226;</div>
                            <div className="lightGray">{displayTimeQuote}</div>
                        </div>
                        {
                            postData.quote_parent[0].parent_post.reply_parent?.length ? 
                            <div style={{textAlign: "left", padding: "5px 0px 0px 40px"}}>
                                Replying to <Link to={`/post/${postData.quote_parent[0].parent_post.reply_parent[0].parent_post.post_id}`} style={{color: "royalblue"}}>{postData.quote_parent[0].parent_post.reply_parent[0].parent_post.author.handle}</Link>
                            </div>
                            :
                            null
                        }
                        <Link to={`/post/${postData.quote_parent[0].parent_post.post_id}`}>
                            <p style={{textAlign: "left", paddingLeft: "40px", marginBottom: "0px"}}>{postData.quote_parent[0].parent_post.content}</p>
                        </Link>
                    </div>
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
                        isLikedPost={isLikedPost}
                        setIsLikedPost={setIsLikedPost}
                        likeCount={likeCount}
                        setLikeCount={setLikeCount}
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
                replyParentHandle={postData.reply_parent?.length ? postData.reply_parent[0].parent_post.author.handle : null}
                modalShow={showQuoteRepost}
                callback={() => setShowQuoteRepost(false)}
            />
        </pre>
    );
}

export {
    Post
}