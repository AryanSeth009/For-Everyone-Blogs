import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");
  const [totalBlogs, setTotalBlogs] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "programming",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finance",
    "travel",
  ];

  const fetchLatestBlogs = async (page = 1) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/latest-blogs`,
        { page }
      );

      // Debug logs
      console.log("Raw API response:", res.data);
      if (res.data.blogs?.[0]) {
        console.log("First blog author data:", res.data.blogs[0].author);
        console.log("First blog personal info:", res.data.blogs[0].author?.personal_info);
      }

      if (!res.data?.blogs) {
        console.error("Invalid blogs data:", res.data);
        return;
      }

      const processedBlogs = res.data.blogs.map(blog => ({
        ...blog,
        author: {
          personal_info: {
            ...blog.author.personal_info
          }
        }
      }));

      setBlogs(prev => [...prev, ...processedBlogs]);
      setTotalBlogs(res.data.totalDocs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
      setLoading(false);
    }
  };

  const fetchBlogsByCategory = async (page = 1) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`,
        { tag: pageState, page }
      );

      if (!data?.blogs) {
        console.error("Invalid category blogs data:", data);
        return;
      }

      // Process the category blogs data
      const processedBlogs = data.blogs.map(blog => ({
        ...blog,
        author: {
          personal_info: {
            fullname: blog.author?.personal_info?.fullname || "Author",
            username: blog.author?.personal_info?.username || "Author Username",
            profile_img: blog.author?.personal_info?.profile_img || "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
          }
        }
      }));

      const formattedData = await filterPaginationData({
        state: blogs,
        data: processedBlogs,
        page,
        countRoute: "/search-blogs-count",
        data_to_send: { tag: pageState },
      });

      setBlogs(formattedData);
    } catch (err) {
      console.error("Error fetching category blogs:", err);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/trending-blogs`
      );

      if (!data?.blogs) {
        console.error("Invalid trending blogs data:", data);
        return;
      }

      // Process trending blogs data
      const processedTrendingBlogs = data.blogs.map(blog => ({
        ...blog,
        author: {
          personal_info: {
            fullname: blog.author?.personal_info?.fullname || "Unknown Author",
            username: blog.author?.personal_info?.username || "unknown",
            profile_img: blog.author?.personal_info?.profile_img || "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
          }
        }
      }));

      setTrendingBlogs(processedTrendingBlogs);
    } catch (err) {
      console.error("Error fetching trending blogs:", err);
    }
  };

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();
    setBlogs(null);
    
    if (pageState === category) {
      setPageState("home");
    } else {
      setPageState(category);
    }
  };

  useEffect(() => {
    if (pageState === "home") {
      fetchLatestBlogs(1);
    } else {
      fetchBlogsByCategory(1);
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Blog List */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : blogs.results?.length ? (
                blogs.results.map((blog, i) => {
                  // Debug log for each blog's author data
                  console.log(`Blog ${i} author data:`, blog.author);
                  
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={blog._id || i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No blogs published" />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>

            {/* Trending Blogs */}
            {trendingBlogs === null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <AnimationWrapper
                  transition={{ duration: 1, delay: i * 0.1 }}
                  key={blog._id || i}
                >
                  <MinimalBlogPost blog={blog} index={i} />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataMessage message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>

        {/* Categories & Trending */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category) => (
                  <button
                    onClick={loadBlogByCategory}
                    className={`tag ${
                      pageState === category ? "bg-black text-white" : ""
                    }`}
                    key={category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending
                <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs === null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={blog._id || i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                ))
              ) : (
                <NoDataMessage message="No trending blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;