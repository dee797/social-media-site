import { useState } from 'react'
import { useOutletContext, Navigate } from 'react-router';
import { useFetchData } from '../helpers';

import { Post } from '../components/Post';
import { FollowUserSnippet } from '../components/FollowUserSnippet';
import Loader from '../components/Loader';
import ServerErrorPage from './ServerErrorPage';

import Card from 'react-bootstrap/Card';


const Home = () => {
    const [currentUser, setCurrentUser, token, setShouldUpdateUser, shouldUpdateUser] = useOutletContext();

    const [homeData, setHomeData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navigateTo, setNavigateTo] = useState(null);


    const url = `${import.meta.env.VITE_BACKEND_URL}/home`;
    useFetchData(token, currentUser, setCurrentUser, setHomeData, setError, setLoading, setNavigateTo, url, null, shouldUpdateUser);


    if (loading) return (<Loader />);

    if (error) return (<ServerErrorPage />);

    if (navigateTo) return (<Navigate to={navigateTo} replace/>)

    return (
        <div style={{minHeight: "85vh", display: "flex", columnGap: "20px", padding: "30px", boxSizing: "border-box", alignItems: "stretch"}}>
            <main style={{flex: 1.5}}>
                <Card style={{height: "fit-content"}}>
                    <Card.Header as="h5">Featured</Card.Header>
                    <Card.Body className='cardBody'>
                        {
                            homeData.posts.length === 0 ?
                                <p>There are currently no posts to view</p>
                            :
                                homeData.posts.map(post => {
                                    return (
                                        <Post 
                                            postData={post} 
                                            currentUser={currentUser} 
                                            setCurrentUser={setCurrentUser} 
                                            setShouldUpdateUser={setShouldUpdateUser} 
                                            token={token} setError={setError} 
                                            isRepost={false}
                                            key={post.post_id}
                                        />
                                    );
                                })
                        }
                    </Card.Body>
                </Card>
            </main>

            <aside style={{flex: 1}}>
                <Card style={{height: "fit-content"}}>
                    <Card.Header as="h5">Who to follow</Card.Header>
                    <Card.Body className='cardBody'>
                        {
                            homeData.users.length === 1 && homeData.users[0]?.user_id === currentUser.userInfo.user_id ?
                                <p>There are currently no users to follow</p>
                            :
                                homeData.users.map(user => {
                                    if (user.user_id !== currentUser?.userInfo.user_id) {
                                        return (
                                            <FollowUserSnippet user={user} key={user.user_id}/>
                                        );
                                    }
                                })
                        }
                    </Card.Body>
                </Card>
            </aside>
        </div>
    );
}

export {
    Home
}