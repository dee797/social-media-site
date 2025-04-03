import { useState } from 'react'
import { useOutletContext, Navigate, useParams, Link } from 'react-router';
import { useFetchData } from '../helpers';

import { Post } from '../components/Post';
import { FollowUserSnippet } from '../components/FollowUserSnippet';
import { FollowButton } from '../components/FollowButton';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';
import ErrorPage from './404ErrorPage';
import Button from 'react-bootstrap/Button';


const Profile = () => {
    const [currentUser, setCurrentUser, token, setShouldUpdateUser, shouldUpdateUser] = useOutletContext();

    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);

    const params = useParams();
    const userHandle = params.handle;


    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${userHandle}/profile`;
    useFetchData(token, currentUser, setCurrentUser, setProfileData, setError, setLoading, setNavigateTo, url, null, shouldUpdateUser);


    if (loading) return (<Loader />);

    if (error?.message === "404") {
        return (<ErrorPage />);
    } else if (error) {
        return (<ServerErrorPage />);
    }
    if (navigateTo) return (<Navigate to={navigateTo} replace/>);

    return (
        <>
            {
                userHandle !== currentUser?.userInfo.handle.slice(1) ?
                <div style={{position: "absolute", right: "30px", padding: "20px"}}>
                    <FollowButton currentUser={currentUser} setCurrentUser={setCurrentUser} setShouldUpdateUser={setShouldUpdateUser} token={token} setError={setError} followedUserId={profileData.userInfo.user_id} key={profileData.userInfo.user_id}/>
                </div>
                : 
                null
            }

            <img width="200" height="200" crossOrigin="anonymous" referrerPolicy="no-referrer" src={profileData.userInfo.banner_pic_url} style={{width: "100%", height: "225px"}}/>
            <div style={{display: 'grid', gridTemplate: "150px 1fr / 275px 1fr", padding: "0px 100px"}}>
                <img width="200" height="200" crossOrigin="anonymous" referrerPolicy="no-referrer" src={profileData.userInfo.profile_pic_url} style={{position: "relative", zIndex: 1, bottom: "75px", borderRadius: "100px", border: "2px solid white"}} />
                <Tabs defaultActiveKey="posts" style={{justifyContent: "space-between", gridColumn: "2/3", margin: "0x 20px", height: "fit-content", alignSelf: "center"}}>
                    <Tab eventKey="posts" title={
                        <>
                            <div>Posts</div>
                            <div>{profileData.posts.length}</div>
                        </>
                    }>
                        {
                            profileData.posts.length === 0 ?
                            <p style={{marginTop: "20px"}}>This user currently doesn't have any posts</p>
                            :
                            profileData.posts.map((post, index) => {
                                let reformattedPostData;
                                let isRepost = false;

                                if ("quote_post" in post) {
                                    reformattedPostData = {
                                        post_id: post.quote_post.post_id,
                                        author_id: post.quote_post.author.user_id,
                                        author: {
                                            user_id: post.quote_post.author.user_id,
                                            handle: post.quote_post.author.handle,
                                            name: post.quote_post.author.name,
                                            profile_pic_url: post.quote_post.author.profile_pic_url
                                        },
                                        quote_parent: [{
                                            parent_post: {
                                                post_id: post.parent_post.post_id,
                                                content: post.parent_post.content, 
                                                date_created: post.parent_post.date_created,
                                                author: {
                                                        user_id: post.parent_post.author.user_id,
                                                        handle: post.parent_post.author.handle,
                                                        name: post.parent_post.author.name,
                                                        profile_pic_url: post.parent_post.author.profile_pic_url
                                                },
                                                reply_parent: 
                                                    post.parent_post.reply_parent?.length ?
                                                    [{
                                                        parent_post: {
                                                            post_id: post.parent_post.reply_parent[0].parent_post.post_id,
                                                            author: {
                                                                user_id: post.parent_post.reply_parent[0].parent_post.author.user_id,
                                                                handle: post.parent_post.reply_parent[0].parent_post.author.handle
                                                            }
                                                        }
                                                    }]
                                                    :
                                                    []
                                            }
                                        }],
                                        content: post.quote_post.content,
                                        date_created: post.quote_post.date_created,
                                    }
                                } else if ("parent_post" in post) {
                                    isRepost = true;
                                    reformattedPostData = post.parent_post;
                                } else {
                                    reformattedPostData = post;
                                }

                                reformattedPostData.numReplies = post.numReplies;
                                reformattedPostData.numReposts = post.numReposts,
                                reformattedPostData.numLikes = post.numLikes

                                return (
                                    <div key={`${reformattedPostData.post_id}-${isRepost ? "r" : ""}`} className='postListItem' style={{marginTop: "10px", paddingBottom: "0px"}}>
                                        { 
                                            isRepost ?
                                            <div style={{color: "gray", textAlign: "left", display: "flex", alignItems: "center", columnGap: "5px"}}>
                                                <svg fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
                                                <path stroke="white" strokeWidth="1.2" d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path>
                                                </svg>
                                                {
                                                    userHandle === currentUser?.userInfo.handle.slice(1) ? 
                                                    <>You reposted</> :
                                                    <>{profileData.userInfo.name} reposted</>
                                                }
                                            </div> :
                                            null
                                        }
                                        <Post 
                                            currentUser={profileData} 
                                            setCurrentUser={setCurrentUser} 
                                            token={token} 
                                            setShouldUpdateUser={setShouldUpdateUser} 
                                            setError={setError} 
                                            postData={reformattedPostData} 
                                            key={`${reformattedPostData.post_id}-${index}-${reformattedPostData.numLikes}`}
                                        />

                                    </div>
                                );
                            })
                        }
                    </Tab>

                    <Tab eventKey="following" title={
                        <>
                            <div>Following</div>
                            <div>{profileData.following.length}</div>
                        </>
                    }>
                        {
                            profileData.following.length === 0 ?
                            <p style={{marginTop: "20px"}}>This user isn't following anyone</p> 
                            :
                            profileData.following.map(user => {
                                return (<FollowUserSnippet user={user.followed_user} key={user.followed_user.user_id}/>);
                            })
                        }
                    </Tab>

                    <Tab eventKey="followers" title={
                        <>
                            <div>Followers</div>
                            <div>{profileData.followers.length}</div>
                        </>
                    }>
                        {
                            profileData.followers.length === 0 ?
                            <p style={{marginTop: "20px"}}>This user doesn't have any followers</p> 
                            :
                            profileData.followers.map(user => {
                                return (<FollowUserSnippet user={user.follower} key={user.follower.user_id}/>);
                            })
                        }
                    </Tab>

                    <Tab eventKey="likedPosts" title={
                        <>
                            <div>Liked Posts</div>
                            <div>{profileData.likedPosts.length}</div>
                        </>
                    }>
                        {
                            profileData.likedPosts.length === 0 ?
                            <p style={{marginTop: "20px"}}>This user hasn't liked any posts</p> 
                            :
                            profileData.likedPosts.map(likedPost => {
                                return (
                                    <Post 
                                        currentUser={currentUser} 
                                        setCurrentUser={setCurrentUser}
                                        token={token}
                                        setShouldUpdateUser={setShouldUpdateUser}
                                        setError={setError}
                                        postData={likedPost.post}
                                        key={likedPost.post.post_id}
                                    />
                                );
                            })
                        }
                    </Tab>

                    <Tab eventKey="replies" title={
                        <>
                            <div>Replies</div>
                            <div>{profileData.replies.length}</div>
                        </>
                    }>
                        {
                            profileData.replies.length === 0 ?
                            <p style={{marginTop: "20px"}}>This user currently doesn't have any replies</p>
                            :
                            profileData.replies.map(reply => {
                                const reformattedPostData = { ...reply.reply_post };
                                reformattedPostData.reply_parent = [{parent_post: reply.parent_post}];

                                reformattedPostData.author = reply.author;
                                
                                reformattedPostData.numReplies = reply.numReplies;
                                reformattedPostData.numReposts = reply.numReposts,
                                reformattedPostData.numLikes = reply.numLikes;

                                return (
                                    <div key={reformattedPostData.post_id} className='postListItem' style={{margin: "0px 17px", paddingBottom: "0px"}}>
                                    
                                        <Post 
                                            currentUser={profileData} 
                                            setCurrentUser={setCurrentUser} 
                                            token={token} 
                                            setShouldUpdateUser={setShouldUpdateUser} 
                                            setError={setError} 
                                            postData={reformattedPostData} 
                                            key={reformattedPostData.post_id}
                                        />

                                    </div>
                                );
                            })
                        }
                    </Tab>

                </Tabs>

                <div style={{gridRow: "2/3", gridColumn: "1/2", margin: "20px 10px", textAlign: "left" }}>
                    <h3>{profileData.userInfo.name}</h3>
                    <p>{profileData.userInfo.handle}</p>
                    {
                        profileData.userInfo.bio ?
                        <p style={{padding: "20px 0px", marginBottom: "0px"}}>{profileData.userInfo.bio}</p>
                        :
                        null
                    }
                    <p>Joined {(new Date(profileData.userInfo.date_joined)).toLocaleDateString()}</p>
                    {
                        userHandle === currentUser?.userInfo.handle.slice(1) ?
                        <Link to="/settings/profile">
                            <Button variant='primary'>Edit Profile</Button> 
                        </Link>
                        :
                        null
                    }
                </div>
            </div>
        </>
    )

}

export {
    Profile
}