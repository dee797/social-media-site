import { useState } from "react";
import { ChooseRepostType } from "./ChooseRepostType";


const RepostButton = ({currentUser, setCurrentUser, token, setShouldUpdateUser, setError, currentPostId, authorId, numReposts, showChooseRepostType, setShowChooseRepostType, setShowQuoteRepost}) => {
    const [isReposted, setIsReposted] = useState(currentUser.posts.find((post) => post.parent_post?.post_id === currentPostId && !post.quote_post));
    const [repostCount, setRepostCount] = useState(numReposts);

    return (
        <>
            {
                isReposted ? 
                    <button type="button" className="repostButton" onClick={() => setShowChooseRepostType(true)}>
                        <svg fill="green" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="36" height="40">
                        <path stroke="white" strokeWidth="0.8" d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path>
                        </svg>
                    </button>
                :
                    <button type="button" className="repostButton" onClick={() => setShowChooseRepostType(true)}>
                        <svg id="postNotReposted" fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="36" height="40">
                        <path stroke="white" strokeWidth="1.2" d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path>
                        </svg>
                    </button>
            }

            {       
                repostCount !== 0 ?
                <div className="countPlaceholder" style={{textAlign: "left", position: "relative", left: "-5px"}}>{repostCount}</div> :
                <div className="countPlaceholder" style={{paddingLeft: "40px"}}></div>
            }

            
            <ChooseRepostType
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                token={token}
                setShouldUpdateUser={setShouldUpdateUser}
                setError={setError}
                isReposted={isReposted}
                setIsReposted={setIsReposted}
                setRepostCount={setRepostCount}
                show={showChooseRepostType}
                setModalShow={setShowChooseRepostType}
                authorId={authorId}
                currentPostId={currentPostId}
                setShowQuoteRepost={setShowQuoteRepost}
            />
        </>
    );
}

export {
    RepostButton
}