import { Link } from "react-router"


const Post = ({postData}) => {
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
        <Link to={`/post/${postData.post_id}`} replace style={{padding: "10px"}}>
            <pre>
                <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
                    <img src={postData.author.profile_pic_url} style={{width: "36px", height: "36px", borderRadius: "18px"}}></img>
                    <div>{postData.author.name}</div>
                    <div className="lightGray">{postData.author.handle}</div>
                    <div className="lightGray">&#8226;</div>
                    <div className="lightGray">{displayTime}</div>
                </div>
                <p style={{textAlign: "left", paddingLeft: "46px"}}>{postData.content}</p>
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

                
                <p>{postData.numReplies}</p>
                <p>{postData.numReposts}</p>
                <p>{postData.numLikes}</p>
            </pre>
        </Link>
    );
}

export {
    Post
}