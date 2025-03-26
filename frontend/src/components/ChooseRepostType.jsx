import { useState } from "react";
import { useNavigate } from "react-router";

import { deleteData, handleSubmitForm } from "../helpers";
import Loader from "./Loader";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


const fetchRepost = async (token, currentUser, setCurrentUser, setShouldUpdateUser, setIsReposted, setRepostCount, setError, setLoading, navigate, url, setModalShow) => {
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

                setModalShow(false);
                setIsReposted(resBody["createRepostSuccess"]);
                setRepostCount((oldLikeCount) => oldLikeCount + 1);
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
        })
    } else {
        setLoading(false);
        navigate("/signup", {replace: true});
    }
}


const ChooseRepostType = ({currentUser, setCurrentUser, token, setShouldUpdateUser, setError, isReposted, setIsReposted, setRepostCount, show, setModalShow, authorId, currentPostId, setShowQuoteRepost}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    return (
        <Modal
            show={show}
            onHide={setModalShow}
            keyboard={false}
            backdrop="static"
            size="sm"
            centered
        >

            {
                loading || !show ? 
                <div style={{height: "200px", display: "flex"}}>
                    <Loader /> 
                </div>
                :
                <>
                <Modal.Body>
                    {
                        isReposted ?
                        <Form
                            method="delete"
                            onSubmit={(event) => {
                                handleSubmitForm(event, setLoading, () => {
                                    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/posts/${currentPostId}/repost`;
                                    deleteData(token, currentUser, setCurrentUser, setShouldUpdateUser, setIsReposted, setRepostCount, setError, setLoading, navigate, url, setModalShow);
                                })
                            }}
                            style={{marginBottom: "10px", width: "100%", display: "flex"}}
                        >
                            <Button style={{flex: 1}} type="submit" variant="danger">Undo Repost</Button>
                        </Form>
                        :
                        <Form
                            method="post"
                            onSubmit={(event) => {
                                handleSubmitForm(event, setLoading, () => {
                                    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.userInfo.user_id}/posts/${currentPostId}/${authorId}/repost`;
                                    fetchRepost(token, currentUser, setCurrentUser, setShouldUpdateUser, setIsReposted, setRepostCount, setError, setLoading, navigate, url, setModalShow);
                                })
                            }}
                            style={{marginBottom: "10px", width: "100%", display: "flex"}}
                        >
                            <Button style={{flex: 1}} type="submit">Repost</Button>
                        </Form>
                    }

                    <Button 
                        style={{width: "100%"}} 
                        type="button"
                        onClick={() => {
                            setModalShow(false);
                            setShowQuoteRepost(true);
                        }}
                    >
                        Quote Repost
                    </Button>
               
                </Modal.Body>
                <Modal.Footer >
                    <Button type="button" variant="secondary" onClick={() => setModalShow(false)}>Cancel</Button>
                </Modal.Footer>
                </>
            }

        </Modal>
    );
}

export {
    ChooseRepostType
}