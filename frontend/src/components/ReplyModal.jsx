import { useState } from 'react';

import { PostForm } from '../pages/NewPost';
import Loader from '../components/Loader';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ReplyModal = ({currentUserId, authorProfilePic, authorName, authorHandle, authorId, postId, postCreated, postContent, modalShow, callback}) => {
    const [loading, setLoading] = useState(false);
    
    const replyurl = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUserId}/posts/${postId}/${authorId}/replies`;



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
                loading ? 
                <div style={{height: "200px", display: "flex"}}>
                    <Loader /> 
                </div>
                :
                <>
                <Modal.Header closeButton>
                    <Modal.Title>Reply</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                        <img src={authorProfilePic} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
                        <div>{authorName}</div>
                        <div className="lightGray">{authorHandle}</div>
                        <div className="lightGray">&#8226;</div>
                        <div className="lightGray">{postCreated}</div>
                    </div>
                    <p style={{textAlign: "left", paddingLeft: "46px"}}>{postContent}</p>

                    <PostForm setLoading={setLoading} url={replyurl} id="reply" setModalShow={callback}/>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='primary' type="submit" form="reply">Post</Button>
                </Modal.Footer>
                </>
            }
        </Modal>
    )
}

export {
    ReplyModal
}