import { useState } from 'react';

import { PostForm } from '../pages/NewPost';
import Loader from '../components/Loader';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const QuoteRepostModal = ({currentUserId, authorProfilePic, authorName, authorHandle, authorId, postId, postCreated, postContent, replyParentHandle, modalShow, callback}) => {
    const [loading, setLoading] = useState(false);
    
    const quoteRepostUrl = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserId}/posts/${postId}/${authorId}/quote_repost`;


    return (
        <Modal
            show={modalShow}
            onHide={callback}
            keyboard={false}
            backdrop="static"
            size="lg"
            centered
        >
            {
                loading || !modalShow ? 
                <div style={{height: "200px", display: "flex"}}>
                    <Loader /> 
                </div>
                :
                <>
                <Modal.Header closeButton>
                    <Modal.Title>Quote Repost</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <PostForm setLoading={setLoading} url={quoteRepostUrl} id="quoteRepost" setModalShow={callback}/>

                    <div style={{padding: "15px", border: "1px solid rgb(220, 220, 220)", borderRadius: "5px", margin: "0px 40px 20px"}}>
                        <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                            <img crossOrigin="anonymous" referrerPolicy="no-referrer" src={authorProfilePic} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
                            <div>{authorName}</div>
                            <div className="lightGray">{authorHandle}</div>
                            <div className="lightGray">&#8226;</div>
                            <div className="lightGray">{postCreated}</div>
                        </div>
                        {
                            replyParentHandle ? 
                            <div style={{textAlign: "left", padding: "10px 0px 10px 56px"}}>
                                Replying to {postId}
                            </div>
                            :
                            null
                        }
                        <p style={{textAlign: "left", paddingLeft: "46px"}}>{postContent}</p>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant='primary' type="submit" form="quoteRepost">Post</Button>
                </Modal.Footer>
                </>
            }
        </Modal>
    )
}

export {
    QuoteRepostModal
}