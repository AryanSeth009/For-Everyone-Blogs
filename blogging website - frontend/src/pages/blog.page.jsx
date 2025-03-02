import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, {
  fetchComments,
} from "../components/comments.component";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import ErrorBoundary from "../components/ErrorBoundary";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author: {
    personal_info: {
      fullname: "Blog Author",
      username: "author",
      profile_img:
        "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
    },
  },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();
  const navigate = useNavigate();
  const { userAuth: { username, access_token } = {} } =
    useContext(UserContext) || {};

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);
  const [error, setError] = useState(null);

  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
    setError(null);
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/get-blog`,
        { blog_id, mode: "read" }
      );

      console.log("Blog data received:", data.blog);
      console.log("Author info:", data.blog.author);

      setBlog(data.blog);

      if (data.blog._id) {
        const comments = await fetchComments({
          blog_id: data.blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded,
        });

        setBlog((prev) => ({
          ...prev,
          comments,
        }));

        // Fetch similar blogs
        if (data.blog.tags?.length > 0) {
          const similarBlogsResponse = await axios.post(
            `${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`,
            {
              tag: data.blog.tags[0],
              limit: 6,
              eliminate_blog: blog_id,
            }
          );
          setSimilarBlogs(similarBlogsResponse.data.blogs);
        }
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err.response?.data?.error || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blog_id) {
      resetStates();
      fetchBlog();
    }
  }, [blog_id]);

  const handleDeleteBlog = () => {
    if (!access_token) {
      return toast.error("Please log in to delete your blog");
    }

    if (confirm("Are you sure you want to delete this blog?")) {
      axios
        .delete(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", {
          headers: { Authorization: `Bearer ${access_token}` },
          data: { blog_id },
        })
        .then(() => {
          toast.success("Blog deleted successfully");
          navigate("/");
        })
        .catch((err) => {
          console.error("Error deleting blog:", err);
          toast.error(err.response?.data?.error || "Failed to delete blog");
        });
    }
  };

  // Ensure we have valid author info
  const authorInfo = {
    fullname: blog.author?.personal_info?.fullname || "Blog Author",
    username: blog.author?.personal_info?.username || "author",
    profile_img:
      blog.author?.personal_info?.profile_img ||
      "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <ErrorBoundary>
            <CommentsContainer />
          </ErrorBoundary>

          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            {blog.banner && (
              <img
                src={blog.banner}
                className="aspect-video"
                alt="Blog banner"
                onError={(e) => {
                  e.target.src =
                    "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg";
                }}
              />
            )}

            <div className="mt-12">
              <h2 className="text-4xl font-medium">{blog.title}</h2>

              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={authorInfo.profile_img}
                    className="w-12 h-12 rounded-full"
                    alt={`${authorInfo.fullname}'s profile`}
                    onError={(e) => {
                      e.target.src =
                        "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg";
                    }}
                  />
                  <div>
                    <p className="text-xl font-medium">{authorInfo.fullname}</p>
                    <p className="text-dark-grey">
                      @
                      <Link
                        to={`/user/${authorInfo.username}`}
                        className="underline"
                      >
                        {authorInfo.username}
                      </Link>
                    </p>
                  </div>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(blog.publishedAt)}
                </p>
              </div>
            </div>

            <ErrorBoundary>
              <BlogInteraction />
            </ErrorBoundary>

            <div className="my-12 font-gelasio blog-page-content">
              {blog.content?.[0]?.blocks?.map((block, i) => (
                <div key={i} className="my-4 md:my-8">
                  <BlogContent block={block} />
                </div>
              ))}
            </div>

            <ErrorBoundary>
              <BlogInteraction />
            </ErrorBoundary>

            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>
                {similarBlogs.map((blog, i) => {
                  const blogAuthorInfo = {
                    fullname:
                      blog.author?.personal_info?.fullname || "Blog Author",
                    username: blog.author?.personal_info?.username || "author",
                    profile_img:
                      blog.author?.personal_info?.profile_img ||
                      "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
                  };

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={blogAuthorInfo} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : null}

            {username === authorInfo.username && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleDeleteBlog}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Delete Blog
                </button>
              </div>
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
