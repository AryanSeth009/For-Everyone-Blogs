import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config(); // Load environment variables


console.log("DB URI:", process.env.DB_LOCATION || process.env.MONGO_URI); // Debugging

mongoose
  .connect(process.env.DB_LOCATION || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    await fixUsersWithNullEmails();
    await fixAllBlogsAuthors();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });



// Correctly define __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildPath = path.resolve(__dirname, "../frontend/dist");
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import Notification from "./Schema/Notification.js";
import Comment from "./Schema/Comment.js";

const server = express();
const PORT = 3000;

// Initialize Firebase Admin SDK
const serviceAccount = {
  "type": "service_account",
  "project_id": "blogging-website-1979c",
  "private_key_id": "06ff0653d17767cc1b025afaee9441ae9c0d2317",
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? 
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDy+CEbQtZ8dFHz\nyPHqfGOT/BPscjJLntqE+wzGvmZdh3c5GHkf/nvzEuWLp0ILHlGowl1LHGxU9dxN\nzbACc0ExCW+hUs+ZOtAguMWBuEPhYq+Xb4gm3bv6t8RJDV8wUTBojyu9QcSmSCNx\nwYjdjHpM5ZTtxQ9V8cC0+7l1hY2mb7sFpcDjhlY7XBhvossKORr2oEPXvAdHMnsL\noc9Z+uQmfVjZgdBdjsStS1yg7vwyu5YqhIaMtv6i600njz2dXYBM1p4uCpMfyJ5o\nG0t68gV69ysyaEXpzMEQbUqFis2IOJ1mONFQlT49WsTbTgDkOCPTO95wcezT5NJ8\nBGbhlMqnAgMBAAECggEAKckgsHaLOrYqjfmmGUSxP3cf2g89tSGpxSsD5H5ETpuI\nloot8qGqoYBDeAQY6J6bPqHGt684tlfePoc8WP+HW66awyzhxSGHP8lnNksBaZa2\nSh4FVWHW/WRzXnjtQPsFj0XoKNFRx6MqbVrydd+9/NGTDl1QqOA92yJbn+mLFe9V\nddFBNGCMwQd1qYVFHhVotR1UMQnq63q1D/7kZT7kDG7AX2VXZ40Npg/bEqbnJUgC\np0Sm1TtP8sScVtcT0tpkvQrqbRSj+R6xXJxnjcf6Ym45+RSWXygTyyY8QMQNr713\n8OdG51DEub6t2/84F8ZgBKV5BmtyJV2D8eF7S5UHWQKBgQD+2fq/vNWtaT+gGM/1\nUdlfxpP3SpKAZkB13DkutX3ACjInqkVkZgtCCqx4q7uV3JXn1szqlrPbxeit7F5h\nAQro24Ib6J2gBO0boR2keFulf+k3KnnJ18eNflcc0pobmHU0sgFA90lP1yY5RScp\ngWXIFVU1mVS2sKbcKsjO04VbhQKBgQD0EHD+nZlaT5i30qhBgkJeKlihiSO2lwuV\nPSDj9hFn5uZOARERHd2nfv621oQPC7Cea+ZZwTk8Hlfif1Ik6H9kJX+tCkdtIBye\nWBxJ55eTMIe1leYX3aIyKEPvtvnoBXNrpfK/VDGPclMr7RK8+IN1Ina2vkFV06mv\nAv+9pMzXOwKBgG4aisSvtrlW0VA/qAjatck1J9Qc+bJTeuHwpRvS+WMwhH6yh4xa\nsd50chMoTsDuLi2dlaZ8OXRnyqDpj9Tk+Gul+k5Ib2Ek/7OCJiZagW29F2roBPn5\nKZOt08D2E/J8KZb8mKIStC+0SiVQBR1fdDO/U7L2ba0IIO7Z5SvGIsVpAoGBAL9I\nc4bateoWIDdSHxTYpnNu9PAFr7vXPfjFZBXGMXYhfbb9Fwc3RRWVbsSV9AJmwxIm\ntu75hYYcsfyOlS7gGZe/3AUe3UQlushPfjxeCmoNyw8CYMerqQduj3A9FDhIrWFd\nOpfBwOYQUCdJMzpv+3e+fxRSoJpHveGwlAdqNjEpAoGAZHVaqdAuY/pBkON7RNib\nEPRwrR/5v1hjcZ3tDKKb7RdPnOrExKWz+liMju2i1DoVKo2ngibb13e3xhl5dRNE\n5kwK5e4Yv5LljFuIMJZGk+uYpxcLvRdNmQfelq4RIhjjKU3E1iSVi5u9inSnrOHG\nrZwSrjwMDT4y9KxNLhuwtzo=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@blogging-website-1979c.iam.gserviceaccount.com",
  "client_id": "118214452274419501524",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40blogging-website-1979c.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// yaaha sai alag h
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.static(buildPath));

server.get("/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

server.use(express.json());
server.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Comprehensive logging middleware
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Add this before your routes
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

// Add this function at the top level
const fixAllBlogsAuthors = async () => {
  try {
    // Get all blogs
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} total blogs`);

    // Get all users
    const users = await User.find({}, "_id personal_info.username");
    console.log(`Found ${users.length} total users`);

    if (users.length === 0) {
      console.log("No users found in the database!");
      return;
    }

    // Use the first user as default author if needed
    const defaultAuthor = users[0];
    console.log("Default author:", defaultAuthor);

    for (const blog of blogs) {
      if (!blog.author) {
        console.log(`Fixing author for blog: ${blog.title}`);
        blog.author = defaultAuthor._id;
        await blog.save();
        console.log(
          `Updated blog ${blog.blog_id} with author ${defaultAuthor._id}`
        );
      }
    }

    console.log("Finished fixing blog authors");
  } catch (err) {
    console.error("Error fixing blog authors:", err);
  }
};

// Add this function at the top level
const fixUsersWithNullEmails = async () => {
  try {
    // Find users with null emails
    const usersToFix = await User.find({
      $or: [{ "personal_info.email": null }, { "personal_info.email": "" }],
    });

    console.log(`Found ${usersToFix.length} users with null emails`);

    // Fix each user
    for (const user of usersToFix) {
      const tempEmail = `user_${user._id}@temp.com`;
      await User.findByIdAndUpdate(user._id, {
        "personal_info.email": tempEmail,
      });
      console.log(`Fixed user ${user._id} with temp email ${tempEmail}`);
    }

    console.log("Finished fixing users with null emails");
  } catch (err) {
    console.error("Error fixing users:", err);
  }
};

// Update the MongoDB connection to call this function


// setting up s3 bucket
// Make sure to import AWS and nanoid at the top of your file
// Using dynamic import for aws-sdk to make it compatible with ES modules
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const AWS = require('aws-sdk');

// Load environment variables - add this at the top of your file
import dotenv from 'dotenv';
dotenv.config();
// Configure AWS S3
// const s3 = new AWS.S3({
//   region: process.env.AWS_BUCKET_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

const generateUploadURL = async () => {
  // Since S3 is not available, return a placeholder URL
  console.log("S3 upload functionality is disabled");
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
  
  // Return a placeholder URL
  return `/placeholder-upload-url/${imageName}`;
  
  // Original S3 code:
  // return await s3.getSignedUrlPromise("putObject", {
  //   Bucket: process.env.AWS_BUCKET_NAME,
  //   Key: imageName,
  //   Expires: 1000,
  //   ContentType: "image/jpeg",
  // });
};

// Export the function so it can be used elsewhere
export { generateUploadURL };

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No access token" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid" });
    }

    req.user = user.id;
    req.admin = user.admin;
    next();
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id, admin: user.admin },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    isAdmin: user.admin,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

// upload image url route
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/signup", async (req, res) => {
  try {
    console.log("Signup Request Received:", req.body);

    let { fullname, email, password } = req.body;

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Convert email to lowercase
    email = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Rest of your signup logic...
    const username = await generateUsername(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
        profile_img:
          "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
      },
      google_auth: false,
      blogs: [],
      account_info: {
        total_posts: 0,
        total_reads: 0,
      },
    });

    const savedUser = await newUser.save();
    return res.status(201).json(formatDatatoSend(savedUser));
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already in use" });
    }
    return res
      .status(500)
      .json({ error: "Error creating user", details: err.message });
  }
});

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "Error occured while login please try again" });
          }

          if (!result) {
            return res.status(403).json({ error: "Incorrect password" });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({
          error:
            "Account was created using google. Try logging in with google.",
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        // login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up without google. Please log in with password to access the account",
          });
        }
      } else {
        // sign up

        let username = await generateUsername(email);

        user = new User({
          personal_info: { fullname: name, email, username },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "Failed to authenticate you with google. Try with some other google account",
      });
    });
});

server.post("/change-password", verifyJWT, (req, res) => {
  let { currentPassword, newPassword } = req.body;

  if (
    !passwordRegex.test(currentPassword) ||
    !passwordRegex.test(newPassword)
  ) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }

  User.findOne({ _id: req.user })
    .then((user) => {
      if (user.google_auth) {
        return res.status(403).json({
          error:
            "You can't change account's password because you logged in through google",
        });
      }

      bcrypt.compare(
        currentPassword,
        user.personal_info.password,
        (err, result) => {
          if (err) {
            return res.status(500).json({
              error:
                "Some error occured while changing the password, please try again later",
            });
          }

          if (!result) {
            return res
              .status(403)
              .json({ error: "Incorrect current password" });
          }

          bcrypt.hash(newPassword, 10, (err, hashed_password) => {
            User.findOneAndUpdate(
              { _id: req.user },
              { "personal_info.password": hashed_password }
            )
              .then((u) => {
                return res.status(200).json({ status: "password changed" });
              })
              .catch((err) => {
                return res.status(500).json({
                  error:
                    "Some error occured while saving new password, please try again later",
                });
              });
          });
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "User not found" });
    });
});

server.post("/latest-blogs", async (req, res) => {
  try {
    let { page } = req.body;
    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;

    // Get blogs with populated author data
    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "author",
        model: "users",
        select:
          "personal_info.fullname personal_info.username personal_info.profile_img",
      })
      .sort({ publishedAt: -1 })
      .skip(skipDocs)
      .limit(maxLimit)
      .lean();

    // Debug log
    console.log(
      "Raw blogs from database:",
      blogs.map((blog) => ({
        title: blog.title,
        authorId: blog.author?._id,
        authorInfo: blog.author?.personal_info,
      }))
    );

    // Process blogs to ensure they have valid author data
    const processedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        // If blog has no author, try to find the original author
        if (!blog.author) {
          const originalAuthor = await User.findOne({ blogs: blog._id })
            .select("personal_info")
            .lean();

          if (originalAuthor) {
            blog.author = {
              _id: originalAuthor._id,
              personal_info: originalAuthor.personal_info,
            };
          } else {
            // If no author found, set default author info
            blog.author = {
              personal_info: {
                fullname: "Blog Author",
                username: blog.title.toLowerCase().replace(/\s+/g, "-"),
                profile_img:
                  "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
              },
            };
          }
        }

        // Ensure author has valid personal_info
        if (!blog.author.personal_info) {
          const user = await User.findById(blog.author)
            .select("personal_info")
            .lean();

          if (user) {
            blog.author.personal_info = user.personal_info;
          }
        }

        return blog;
      })
    );

    // Debug log
    console.log(
      "Processed blogs:",
      processedBlogs.map((blog) => ({
        title: blog.title,
        author: blog.author?.personal_info,
      }))
    );

    return res.status(200).json({ blogs: processedBlogs });
  } catch (err) {
    console.error("Error in latest-blogs:", err);
    return res.status(500).json({ error: err.message });
  }
});

server.post("/all-latest-blogs-count", (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.get("/trending-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({
        "activity.total_read": -1,
        "activity.total_likes": -1,
        publishedAt: -1,
      })
      .select("blog_id title publishedAt -_id")
      .limit(5);

    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.post("/search-blogs", (req, res) => {
  let { tag, query, author, page, limit, eliminate_blog } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  let maxLimit = limit ? limit : 2;

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/search-blogs-count", (req, res) => {
  let { tag, author, query } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/search-users", (req, res) => {
  let { query } = req.body;

  User.find({ "personal_info.username": new RegExp(query, "i") })
    .limit(50)
    .select(
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/get-profile", (req, res) => {
  let { username } = req.body;

  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -google_auth -updatedAt -blogs")
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/update-profile-img", verifyJWT, (req, res) => {
  let { url } = req.body;

  User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url })
    .then(() => {
      return res.status(200).json({ profile_img: url });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/update-profile", verifyJWT, (req, res) => {
  let { username, bio, social_links } = req.body;

  let bioLimit = 150;

  if (username.length < 3) {
    return res
      .status(403)
      .json({ error: "Username should be at least 3 letters long" });
  }

  if (bio.length > bioLimit) {
    return res
      .status(403)
      .json({ error: `Bio should not be more than ${bioLimit} characters` });
  }

  let socialLinksArr = Object.keys(social_links);

  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      if (social_links[socialLinksArr[i]].length) {
        let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != "website"
        ) {
          return res.status(403).json({
            error: `${socialLinksArr[i]} link is invalid. You must enter a full link`,
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({
      error: "You must provide full social links with http(s) included",
    });
  }

  let updateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  };

  User.findOneAndUpdate({ _id: req.user }, updateObj, {
    runValidators: true,
  })
    .then(() => {
      return res.status(200).json({ username });
    })
    .catch((err) => {
      if (err.code == 11000) {
        return res.status(409).json({ error: "username is already taken" });
      }
      return res.status(500).json({ error: err.message });
    });
});

server.post("/create-blog", verifyJWT, async (req, res) => {
  try {
    let { title, des, banner, tags, content, draft, id } = req.body;
    const user_id = req.user;

    // Get the user's info
    const user = await User.findById(user_id).select("personal_info");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Creating blog with author:", {
      userId: user_id,
      username: user.personal_info.username,
    });

    // Validate blog data...
    if (!title.length) {
      return res.status(403).json({ error: "You must provide a title" });
    }
    // ... other validations ...

    let blog_id =
      id ||
      title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim() + nanoid();

    // If updating existing blog
    if (id) {
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        {
          title,
          des,
          banner,
          content,
          tags,
          draft: draft ? draft : false,
          author: user_id, // Ensure author is set
        },
        { new: true }
      ).populate("author", "personal_info");

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      console.log("Updated blog:", {
        id: blog.blog_id,
        author: blog.author?.personal_info,
      });

      return res.status(200).json({ id: blog_id });
    }

    // Create new blog
    const blog = new Blog({
      title,
      des,
      banner,
      content,
      tags,
      author: user_id, // Set the author
      blog_id,
      draft: Boolean(draft),
    });

    const savedBlog = await blog.save();

    // Update user's blogs array
    await User.findByIdAndUpdate(user_id, {
      $push: { blogs: savedBlog._id },
      $inc: { "account_info.total_posts": draft ? 0 : 1 },
    });

    console.log("Created blog:", {
      id: savedBlog.blog_id,
      author: user.personal_info,
    });

    return res.status(200).json({ id: blog_id });
  } catch (err) {
    console.error("Error creating blog:", err);
    return res.status(500).json({ error: err.message });
  }
});

server.post("/get-blog", async (req, res) => {
  try {
    let { blog_id, mode } = req.body;

    // Find the blog and populate author info
    const blog = await Blog.findOne({ blog_id })
      .populate({
        path: "author",
        select: "personal_info",
      })
      .select(
        "title des content banner activity publishedAt blog_id tags author"
      );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // If we're in draft mode, verify the user
    if (mode == "edit") {
      const user_id = req.user;
      if (!user_id) {
        return res.status(401).json({ error: "Login to access this blog" });
      }

      if (blog.author._id.toString() !== user_id.toString()) {
        return res.status(403).json({ error: "You can't edit this blog" });
      }
    }

    // Ensure blog has valid author info
    if (!blog.author || !blog.author.personal_info) {
      // Try to find the original author
      const originalAuthor = await User.findOne({ blogs: blog._id })
        .select("personal_info")
        .lean();

      if (originalAuthor) {
        blog.author = {
          _id: originalAuthor._id,
          personal_info: originalAuthor.personal_info,
        };
      } else {
        // Set default author info
        blog.author = {
          personal_info: {
            fullname: "Blog Author",
            username: "author",
            profile_img:
              "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
          },
        };
      }
    }

    return res.status(200).json({ blog });
  } catch (err) {
    console.error("Error in get-blog:", err);
    return res.status(500).json({ error: err.message });
  }
});

server.post("/like-blog", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id, islikedByUser } = req.body;

  let incrementVal = !islikedByUser ? 1 : -1;

  Blog.findOneAndUpdate(
    { _id },
    { $inc: { "activity.total_likes": incrementVal } }
  ).then((blog) => {
    if (!islikedByUser) {
      let like = new Notification({
        type: "like",
        blog: _id,
        notification_for: blog.author,
        user: user_id,
      });

      like.save().then((notification) => {
        return res.status(200).json({ liked_by_user: true });
      });
    } else {
      Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" })
        .then((data) => {
          return res.status(200).json({ liked_by_user: false });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    }
  });
});

server.post("/isliked-by-user", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id } = req.body;

  Notification.exists({ user: user_id, type: "like", blog: _id })
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/add-comment", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id, comment, blog_author, replying_to, notification_id } = req.body;

  if (!comment.length) {
    return res
      .status(403)
      .json({ error: "Write something to leave a comment" });
  }

  // creating a comment doc
  let commentObj = {
    blog_id: _id,
    blog_author,
    comment,
    commented_by: user_id,
  };

  if (replying_to) {
    commentObj.parent = replying_to;
    commentObj.isReply = true;
  }

  new Comment(commentObj).save().then(async (commentFile) => {
    let { comment, commentedAt, children } = commentFile;

    Blog.findOneAndUpdate(
      { _id: commentFile.blog_id },
      {
        $push: { comments: commentFile._id },
        $inc: {
          "activity.total_comments": 1,
          "activity.total_parent_comments": replying_to ? 0 : 1,
        },
      }
    ).then((blog) => {
      console.log("New comment created");
    });

    let notificationObj = {
      type: replying_to ? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    };

    if (replying_to) {
      notificationObj.replied_on_comment = replying_to;

      await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: commentFile._id } }
      ).then((replyingToCommentDoc) => {
        notificationObj.notification_for = replyingToCommentDoc.commented_by;
      });

      if (notification_id) {
        Notification.findOneAndUpdate(
          { _id: notification_id },
          { reply: commentFile._id }
        ).then((notificaiton) => console.log("notification updated"));
      }
    }

    new Notification(notificationObj)
      .save()
      .then((notification) => console.log("new notification created"));

    return res.status(200).json({
      comment,
      commentedAt,
      _id: commentFile._id,
      user_id,
      children,
    });
  });
});

server.post("/get-blog-comments", (req, res) => {
  let { blog_id, skip } = req.body;

  let maxLimit = 5;

  Comment.find({ blog_id, isReply: false })
    .populate(
      "commented_by",
      "personal_info.username personal_info.fullname personal_info.profile_img"
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({
      commentedAt: -1,
    })
    .then((comment) => {
      console.log(comment, blog_id, skip);
      return res.status(200).json(comment);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/get-replies", (req, res) => {
  let { _id, skip } = req.body;

  let maxLimit = 5;

  Comment.findOne({ _id })
    .populate({
      path: "children",
      options: {
        limit: maxLimit,
        skip: skip,
        sort: { commentedAt: -1 },
      },
      populate: {
        path: "commented_by",
        select:
          "personal_info.profile_img personal_info.fullname personal_info.username",
      },
      select: "-blog_id -updatedAt",
    })
    .select("children")
    .then((doc) => {
      console.log(doc);
      return res.status(200).json({ replies: doc.children });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

const deleteComments = (_id) => {
  Comment.findOneAndDelete({ _id })
    .then((comment) => {
      if (comment.parent) {
        Comment.findOneAndUpdate(
          { _id: comment.parent },
          { $pull: { children: _id } }
        )
          .then((data) => console.log("comment delete from parent"))
          .catch((err) => console.log(err));
      }

      Notification.findOneAndDelete({ comment: _id }).then((notification) =>
        console.log("comment notification deleted")
      );

      Notification.findOneAndUpdate(
        { reply: _id },
        { $unset: { reply: 1 } }
      ).then((notification) => console.log("reply notification deleted"));

      Blog.findOneAndUpdate(
        { _id: comment.blog_id },
        {
          $pull: { comments: _id },
          $inc: { "activity.total_comments": -1 },
          "activity.total_parent_comments": comment.parent ? 0 : -1,
        }
      ).then((blog) => {
        if (comment.children.length) {
          comment.children.map((replies) => {
            deleteComments(replies);
          });
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

server.post("/delete-comment", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id } = req.body;

  Comment.findOne({ _id }).then((comment) => {
    if (user_id == comment.commented_by || user_id == comment.blog_author) {
      deleteComments(_id);

      return res.status(200).json({ status: "done" });
    } else {
      return res.status(403).json({ error: "You can not delete this commet" });
    }
  });
});

server.get("/new-notification", verifyJWT, (req, res) => {
  let user_id = req.user;

  Notification.exists({
    notification_for: user_id,
    seen: false,
    user: { $ne: user_id },
  })
    .then((result) => {
      if (result) {
        return res.status(200).json({ new_notification_available: true });
      } else {
        return res.status(200).json({ new_notification_available: false });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/notifications", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { page, filter, deletedDocCount } = req.body;

  let maxLimit = 10;

  let findQuery = { notification_for: user_id, user: { $ne: user_id } };

  let skipDocs = (page - 1) * maxLimit;

  if (filter != "all") {
    findQuery.type = filter;
  }

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate("blog", "title blog_id")
    .populate(
      "user",
      "personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .populate("comment", "comment")
    .populate("replied_on_comment", "comment")
    .populate("reply", "comment")
    .sort({ createdAt: -1 })
    .select("createdAt type seen reply")
    .then((notifications) => {
      Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then(() => console.log("notification seen"));

      return res.status(200).json({ notifications });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/all-notifications-count", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { filter } = req.body;

  let findQuery = { notification_for: user_id, user: { $ne: user_id } };

  if (filter != "all") {
    findQuery.type = filter;
  }

  Notification.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/user-written-blogs", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { page, draft, query, deletedDocCount } = req.body;

  let maxLimit = 5;
  let skipDocs = (page - 1) * maxLimit;

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Blog.find({ author: user_id, draft, title: new RegExp(query, "i") })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select(" title banner publishedAt blog_id activity des draft -_id ")
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/user-written-blogs-count", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { draft, query } = req.body;

  Blog.countDocuments({ author: user_id, draft, title: new RegExp(query, "i") })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.delete("/delete-blog", verifyJWT, async (req, res) => {
  try {
    console.log("DELETE /delete-blog route hit");
    console.log("Full request details:", req.body);

    const user_id = req.user;
    const { blog_id } = req.body;

    // Validate input
    if (!blog_id) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    // Find the blog using string comparison, avoiding ObjectId casting
    const blog = await Blog.findOne({
      blog_id: { $eq: blog_id },
      author: user_id,
    });

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found or you don't have permission to delete",
        details: {
          blog_id,
          user_id,
        },
      });
    }

    // Delete the blog using string comparison
    const deletedBlog = await Blog.findOneAndDelete({
      blog_id: { $eq: blog_id },
      author: user_id,
    });

    if (!deletedBlog) {
      return res.status(500).json({
        error: "Failed to delete blog",
        details: {
          blog_id,
          user_id,
        },
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ blog_id: blog_id });

    res.status(200).json({
      message: "Blog deleted successfully",
      deletedBlog: {
        blog_id: deletedBlog.blog_id,
        title: deletedBlog.title,
      },
    });
  } catch (error) {
    console.error("Error in delete-blog route:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      details: error.stack,
    });
  }
});

// Add this route to debug and fix author data
server.get("/debug-fix-authors", async (req, res) => {
  try {
    // Get all blogs
    const blogs = await Blog.find({}).lean();
    console.log(`Found ${blogs.length} blogs`);

    // Get all users
    const users = await User.find({}).select("personal_info").lean();
    console.log(`Found ${users.length} users`);

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    // Log the first user and first blog for debugging
    console.log("First user:", {
      id: users[0]._id,
      username: users[0].personal_info?.username,
      fullname: users[0].personal_info?.fullname,
    });

    if (blogs.length > 0) {
      console.log("First blog:", {
        id: blogs[0]._id,
        title: blogs[0].title,
        authorId: blogs[0].author,
      });
    }

    // Fix blogs without authors
    let fixedCount = 0;
    for (const blog of blogs) {
      if (!blog.author) {
        const result = await Blog.findByIdAndUpdate(blog._id, {
          author: users[0]._id,
        });
        if (result) fixedCount++;
      }
    }

    // Verify the fix
    const verifyBlogs = await Blog.find({})
      .populate({
        path: "author",
        select:
          "personal_info.fullname personal_info.username personal_info.profile_img",
      })
      .lean();

    const blogAuthors = verifyBlogs.map((blog) => ({
      blogId: blog._id,
      title: blog.title,
      authorId: blog.author?._id,
      authorInfo: blog.author?.personal_info,
    }));

    return res.json({
      totalBlogs: blogs.length,
      totalUsers: users.length,
      fixedBlogs: fixedCount,
      blogAuthors,
    });
  } catch (err) {
    console.error("Debug route error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add this route before the error handling middleware
server.get("/debug-blog-authors", async (req, res) => {
  try {
    // Get all blogs
    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "author",
        model: "users",
        select:
          "personal_info.fullname personal_info.username personal_info.profile_img",
      })
      .lean();

    // Get all users
    const users = await User.find({}).select("personal_info").lean();

    console.log("Debug data:", {
      totalBlogs: blogs.length,
      totalUsers: users.length,
      firstBlog: blogs[0]
        ? {
            title: blogs[0].title,
            authorId: blogs[0].author?._id,
            authorInfo: blogs[0].author?.personal_info,
          }
        : null,
      firstUser: users[0]
        ? {
            id: users[0]._id,
            username: users[0].personal_info?.username,
            fullname: users[0].personal_info?.fullname,
          }
        : null,
    });

    return res.status(200).json({
      blogs: blogs.map((blog) => ({
        title: blog.title,
        authorId: blog.author?._id,
        authorInfo: blog.author?.personal_info,
      })),
      users: users.map((user) => ({
        id: user._id,
        username: user.personal_info?.username,
        fullname: user.personal_info?.fullname,
      })),
    });
  } catch (err) {
    console.error("Debug route error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add this route to fix a specific blog's author
server.post("/fix-blog-author", async (req, res) => {
  try {
    const { blog_id, username } = req.body;

    // Find the user
    const user = await User.findOne({
      "personal_info.username": username,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the blog
    const blog = await Blog.findOneAndUpdate(
      { blog_id },
      { author: user._id },
      { new: true }
    ).populate({
      path: "author",
      select:
        "personal_info.fullname personal_info.username personal_info.profile_img",
    });

    return res.json({ blog });
  } catch (err) {
    console.error("Fix author error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add this route to fix all blog authors
server.get("/fix-blog-authors", async (req, res) => {
  try {
    // Get the default author
    const defaultAuthor = await User.findOne({
      "personal_info.username": "setharyan53",
    });

    if (!defaultAuthor) {
      return res.status(404).json({ error: "Default author not found" });
    }

    // Update all blogs without authors
    const result = await Blog.updateMany(
      { $or: [{ author: { $exists: false } }, { author: null }] },
      { $set: { author: defaultAuthor._id } }
    );

    // Get all blogs to verify
    const blogs = await Blog.find({})
      .populate({
        path: "author",
        select: "personal_info.username personal_info.fullname",
      })
      .lean();

    return res.json({
      message: "Fixed blog authors",
      updatedCount: result.modifiedCount,
      blogs: blogs.map((blog) => ({
        title: blog.title,
        author: blog.author?.personal_info,
      })),
    });
  } catch (err) {
    console.error("Error fixing blog authors:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add this route to create organization accounts
server.post("/create-org-authors", async (req, res) => {
  try {
    // List of organizations/authors
    const authors = [
      {
        fullname: "GeeksforGeeks",
        username: "geeksforgeeks",
        email: "contact@geeksforgeeks.org",
        profile_img: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
      },
      {
        fullname: "FreeCodeCamp",
        username: "freecodecamp",
        email: "team@freecodecamp.org",
        profile_img: "https://www.freecodecamp.org/icons/icon-144x144.png",
      },
      {
        fullname: "Social Media Examiner",
        username: "socialmediaexaminer",
        email: "info@socialmediaexaminer.com",
        profile_img: "/default-profile.png",
      },
      {
        fullname: "Nomadic Matt",
        username: "nomadicmatt",
        email: "matt@nomadicmatt.com",
        profile_img: "/default-profile.png",
      },
    ];

    // Create user accounts for each author
    const createdAuthors = await Promise.all(
      authors.map(async (author) => {
        // Check if author already exists
        const existingUser = await User.findOne({
          "personal_info.username": author.username,
        });

        if (existingUser) {
          return existingUser;
        }

        // Create new user
        const newUser = new User({
          personal_info: {
            fullname: author.fullname,
            username: author.username,
            email: author.email,
            profile_img: author.profile_img,
          },
        });

        return await newUser.save();
      })
    );

    // Update blogs with correct authors
    await Promise.all([
      Blog.findOneAndUpdate(
        { title: /GeeksforGeeks/i },
        {
          author: createdAuthors.find(
            (a) => a.personal_info.username === "geeksforgeeks"
          )?._id,
        }
      ),
      Blog.findOneAndUpdate(
        { title: /FreeCodeCamp/i },
        {
          author: createdAuthors.find(
            (a) => a.personal_info.username === "freecodecamp"
          )?._id,
        }
      ),
      Blog.findOneAndUpdate(
        { title: /Social Media/i },
        {
          author: createdAuthors.find(
            (a) => a.personal_info.username === "socialmediaexaminer"
          )?._id,
        }
      ),
      Blog.findOneAndUpdate(
        { title: /Nomadic Matt/i },
        {
          author: createdAuthors.find(
            (a) => a.personal_info.username === "nomadicmatt"
          )?._id,
        }
      ),
    ]);

    return res.json({
      message: "Created organization authors and updated blogs",
      authors: createdAuthors.map((author) => ({
        fullname: author.personal_info.fullname,
        username: author.personal_info.username,
      })),
    });
  } catch (err) {
    console.error("Error creating org authors:", err);
    return res.status(500).json({ error: err.message });
  }
});

server.post("/fix-blog-relationships", async (req, res) => {
  try {
    const { blog_id, author_username } = req.body;

    // Find the user
    const user = await User.findOne({
      "personal_info.username": author_username,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the blog
    const blog = await Blog.findOne({ blog_id });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Update blog's author
    blog.author = user._id;
    await blog.save();

    // Add blog to user's blogs array if not already there
    if (!user.blogs.includes(blog._id)) {
      user.blogs.push(blog._id);
      await user.save();
    }

    return res.json({
      message: "Blog relationships fixed",
      blog: {
        title: blog.title,
        author: {
          username: user.personal_info.username,
          fullname: user.personal_info.fullname,
        },
      },
    });
  } catch (err) {
    console.error("Error fixing blog relationships:", err);
    return res.status(500).json({ error: err.message });
  }
});

server.post("/fix-specific-blog-author", async (req, res) => {
  try {
    const { blog_id } = req.body;

    // Find the blog
    const blog = await Blog.findOne({ blog_id });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the user who created this blog
    const user = await User.findOne({ blogs: blog._id });
    if (!user) {
      return res.status(404).json({ error: "Original author not found" });
    }

    // Update the blog's author
    blog.author = user._id;
    await blog.save();

    // Verify the update
    const updatedBlog = await Blog.findById(blog._id)
      .populate("author", "personal_info")
      .lean();

    return res.json({
      message: "Blog author fixed",
      blog: {
        title: updatedBlog.title,
        author: updatedBlog.author.personal_info,
      },
    });
  } catch (err) {
    console.error("Error fixing blog author:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Global error handling middleware
server.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  // Log detailed error information
  console.error("Error Name:", err.name);
  console.error("Error Message:", err.message);
  console.error("Error Stack:", err.stack);

  // Send a more informative error response
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
  });
});

// Ignore the 404 errors for /hybridaction/zybTrackerStatisticsAction
server.use((req, res, next) => {
  if (req.path.includes("zybTrackerStatisticsAction")) {
    return res.status(200).json({ status: "ok" });
  }
  next();
});

server.get("/check-blog-author/:blog_id", async (req, res) => {
  try {
    const { blog_id } = req.params;

    // Find the blog
    const blog = await Blog.findOne({ blog_id })
      .populate({
        path: "author",
        select: "personal_info",
      })
      .lean();

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find users who have this blog in their blogs array
    const potentialAuthors = await User.find({
      blogs: blog._id,
    })
      .select("personal_info")
      .lean();

    return res.json({
      blog: {
        title: blog.title,
        currentAuthor: blog.author?.personal_info,
        potentialAuthors: potentialAuthors.map((user) => user.personal_info),
      },
    });
  } catch (err) {
    console.error("Error checking blog author:", err);
    return res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
