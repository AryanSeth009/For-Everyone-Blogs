import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
    const { blog, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);
    
    // Add null checks using optional chaining
    const {
        _id,
        author,
        comments = { results: [] },
        activity = { total_comments: 0, total_parent_comments: 0 }
    } = blog || {};

    const blog_author = author?._id;
    const { total_comments, total_parent_comments } = activity;
    
    const { userAuth: { access_token, username, fullname, profile_img } = {} } = useContext(UserContext) || {};

    const [comment, setComment] = useState("");

    const handleComment = () => {
        if (!access_token) return toast.error("Login first to leave a comment");
        if (!comment.length) return toast.error("Write something to leave a comment...");
        if (!_id || !blog_author) return toast.error("Blog data not loaded properly");

        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/add-comment`, {
            _id, blog_author, comment, replying_to: replyingTo
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {
            setComment("");

            data.commented_by = { personal_info: { username, profile_img, fullname } };
            let newCommentArr;

            if (replyingTo) {
                const commentIndex = comments.results[index];
                if (!commentIndex) return;
                
                commentIndex.children = commentIndex.children || [];
                commentIndex.children.push(data._id);
                data.childrenLevel = commentIndex.childrenLevel + 1;
                data.parentIndex = index;
                commentIndex.isReplyLoaded = true;
                comments.results.splice(index + 1, 0, data);
                newCommentArr = comments.results;
                setReplying(false);
            } else {
                data.childrenLevel = 0;
                newCommentArr = [data, ...comments.results];
            }

            let parentCommentIncrement = replyingTo ? 0 : 1;
            setBlog({
                ...blog,
                comments: { ...comments, results: newCommentArr },
                activity: { 
                    ...activity, 
                    total_comments: total_comments + 1, 
                    total_parent_comments: total_parent_comments + parentCommentIncrement 
                }
            });

            setTotalParentCommentsLoaded(prev => prev + parentCommentIncrement);
        })
        .catch(err => {
            console.error(err);
            toast.error("Failed to post comment. Please try again.");
        });
    };

    return (
        <>
            <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}     
                placeholder="Leave a comment..." 
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            />
            <button 
                onClick={handleComment}
                className="btn-dark px-10"
            >
                {action}
            </button>
            <Toaster />
        </>
    );
};

export default CommentField;