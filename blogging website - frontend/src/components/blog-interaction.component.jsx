import React, { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { UserContext } from "../App";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";

const BlogInteraction = () => {
    const location = useLocation();
    const { blog, setBlog, islikedByUser, setLikedByUser, setCommentsWrapper } = useContext(BlogContext);
    const { userAuth: { username, access_token } } = useContext(UserContext);

    // Add default values and safe checks for all nested objects
    const {
        _id,
        title = '',
        blog_id = '',
        activity = {
            total_likes: 0,
            total_comments: 0
        },
        author = {
            personal_info: {
                username: ''
            }
        }
    } = blog || {};

    const total_likes = activity?.total_likes || 0;
    const total_comments = activity?.total_comments || 0;
    const author_username = author?.personal_info?.username || '';

    useEffect(() => {
        // Only make the API call if we have both access_token and _id
        if (access_token && _id) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", 
                { _id }, 
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                }
            )
            .then(({ data: { result } }) => {
                setLikedByUser(Boolean(result));
            })
            .catch(error => {
                console.error("Error checking like status:", error);
            });
        }
    }, [access_token, _id, setLikedByUser]);

    const handleLike = () => {
        if (!access_token) {
            return toast.error("Please login to like this blog");
        }

        // Calculate new total likes
        const newTotalLikes = islikedByUser ? total_likes - 1 : total_likes + 1;

        // Optimistically update UI
        setLikedByUser(prev => !prev);
        setBlog(prevBlog => ({
            ...prevBlog,
            activity: {
                ...prevBlog.activity,
                total_likes: newTotalLikes
            }
        }));

        // Make API call
        axios.post(
            import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
            { _id, islikedByUser },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }
        )
        .then(({ data }) => {
            console.log("Like updated successfully:", data);
        })
        .catch(error => {
            // Revert optimistic update on error
            setLikedByUser(prev => !prev);
            setBlog(prevBlog => ({
                ...prevBlog,
                activity: {
                    ...prevBlog.activity,
                    total_likes: total_likes
                }
            }));
            console.error("Error updating like:", error);
            toast.error("Failed to update like status");
        });
    };

    if (!blog) {
        return null;
    }

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleLike}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            islikedByUser ? "bg-red/20 text-red" : "bg-grey/80"
                        }`}
                    >
                        <i className={`fi ${islikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button
                        onClick={() => setCommentsWrapper(prev => !prev)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
                    >
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>

                <div className="flex gap-6 items-center">
                    {username === author_username && (
                        <Link 
                            to={`/editor/${blog_id}`} 
                            className="underline hover:text-purple"
                        >
                            Edit
                        </Link>
                    )}

                    <Link 
                        to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;