/* eslint-disable react/prop-types */
import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content = {}, author = {} }) => {
    // Provide default values to prevent destructuring errors
    const { 
        publishedAt = "", 
        tags = [], 
        title = "Untitled", 
        des = "No description available", 
        banner = "", 
        activity = {}, 
        blog_id: id = "#" 
    } = content;

    const { fullname = "Unknown", profile_img = "", username = "unknown" } = author;
    const total_likes = activity?.total_likes || 0; // Avoid undefined errors

    return (
        <Link to={`/blog/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 items-center mb-7">
                    {profile_img && <img src={profile_img} className="w-6 h-6 rounded-full" alt="Profile" />}
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(publishedAt) || "Unknown date"}</p>
                </div>

                <h1 className="blog-title">{title}</h1>

                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                    {des}
                </p>

                <div className="flex gap-4 mt-7">
                    {tags.length > 0 && <span className="btn-light py-1 px-4">{tags[0]}</span>}
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart text-xl"></i>
                        {total_likes}
                    </span>
                </div>
            </div>

            {banner && (
                <div className="h-28 aspect-square bg-grey">
                    <img src={banner} className="w-full h-full aspect-square object-cover" alt="Banner" />
                </div>
            )}
        </Link>
    );
};

export default BlogPostCard;
