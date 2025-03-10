# Vercel Deployment Guide for For-Everyone-Blogs

This guide provides detailed instructions for deploying the For-Everyone-Blogs monorepo (frontend + backend) to Vercel.

## Prerequisites

- A Vercel account
- Your For-Everyone-Blogs repository on GitHub/GitLab/Bitbucket
- MongoDB Atlas database

## Step 1: Prepare Your Project

Ensure your project has the following configuration files:

1. **Root `vercel.json`**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "frontend/dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/server/vercel.js" },
       { "source": "/(latest-blogs|trending-blogs|search-blogs|get-blog|get-profile|get-upload-url|user-written-blogs|notifications|search-users|update-profile|update-profile-img|change-password|add-comment|delete-comment|like-blog|isliked-by-user|create-blog|delete-blog|new-notification|get-blog-comments)(.*)", "destination": "/server/vercel.js" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Frontend `.env.production`**:
   ```
   VITE_SERVER_DOMAIN=https://your-vercel-app-name.vercel.app
   ```

3. **Server `vercel.js`**:
   ```javascript
   // Vercel serverless entry point
   const server = require('./server');

   // Export the Express app directly
   module.exports = server;
   ```

## Step 2: Deploy to Vercel

1. Push your code to your Git repository
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "Add New" > "Project"
4. Import your Git repository
5. Configure the project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: frontend/dist
   - Install Command: npm install

## Step 3: Set Environment Variables

In the Vercel project settings, add these environment variables:

- `MONGO_URI`: Your MongoDB connection string
- `DB_LOCATION`: Same as MONGO_URI
- `FRONTEND_URL`: Your Vercel app URL (e.g., https://your-app.vercel.app)
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key
- `NODE_ENV`: production

## Step 4: Redeploy

After setting the environment variables, trigger a new deployment:

1. Go to the Deployments tab
2. Click "Redeploy" on your latest deployment

## Setting Up Environment Variables in Vercel

For your application to work correctly in production, you need to set up environment variables in the Vercel dashboard:

1. **Log in to your Vercel dashboard** at [vercel.com](https://vercel.com)

2. **Select your project** (For-Everyone-Blogs)

3. **Navigate to Settings**:
   - Click on the "Settings" tab in the top navigation bar

4. **Go to Environment Variables**:
   - In the left sidebar, click on "Environment Variables"

5. **Add the following environment variables**:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `VITE_SERVER_DOMAIN` | `https://for-everyone-blogs.vercel.app` | Production, Preview, Development |
   | `FRONTEND_URL` | `https://for-everyone-blogs.vercel.app` | Production, Preview, Development |
   | `MONGODB_URL` | `your-mongodb-connection-string` | Production, Preview, Development |
   | `JWT_SECRET` | `your-jwt-secret` | Production, Preview, Development |

6. **Click "Save"** to apply these environment variables

7. **Redeploy your application**:
   - Go to the "Deployments" tab
   - Find your latest deployment
   - Click the three dots menu (⋮)
   - Select "Redeploy"

This step is critical because the frontend needs to know the correct URL to connect to the backend API. If this environment variable is not set correctly, you'll see CORS errors and the application won't function properly.

## Troubleshooting

### CORS and HTTP Method Issues

If you're seeing CORS errors like:

```
Access to XMLHttpRequest at 'https://your-app.vercel.app/latest-blogs' from origin 'https://for-everyone-blogs.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This indicates there are issues with either:

1. **Incorrect API URL**: The frontend is trying to access a placeholder URL instead of your actual Vercel domain. Check:
   - `.env.production` file to ensure it has `VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app`
   - Make sure this file is included in your deployment
   - Consider using a centralized API config file (like `api-config.js`) to manage the API domain

2. **HTTP Method Mismatch**: The frontend is using a different HTTP method than what the server expects. For example:
   - Server defines endpoint with `server.post("/latest-blogs")` but frontend uses `axios.get()`
   - Fix by either updating the frontend to use the correct method or making the server accept both methods with `server.all()`

3. **CORS Configuration**: Make sure your server has proper CORS configuration:
   ```javascript
   // In server.js
   server.use((req, res, next) => {
     const allowedOrigins = [
       process.env.FRONTEND_URL, 
       "https://for-everyone-blogs.vercel.app",
       "http://localhost:5173"
     ];
     
     const origin = req.headers.origin;
     
     if (allowedOrigins.includes(origin)) {
       res.setHeader("Access-Control-Allow-Origin", origin);
     } else {
       res.setHeader("Access-Control-Allow-Origin", "*");
     }
     
     res.setHeader("Access-Control-Allow-Credentials", "true");
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     
     if (req.method === "OPTIONS") {
       return res.status(200).end();
     }
     
     next();
   });
   ```

4. **Vercel Headers Configuration**: In your `vercel.json`, add headers configuration:
   ```json
   "headers": [
     {
       "source": "/(.*)",
       "headers": [
         { "key": "Access-Control-Allow-Credentials", "value": "true" },
         { "key": "Access-Control-Allow-Origin", "value": "*" },
         { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
         { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
       ]
     }
   ]
   ```

### 405 Method Not Allowed Errors

If you're seeing "405 Method Not Allowed" errors when accessing API endpoints:

1. **Check HTTP Methods**: Ensure that the frontend is using the correct HTTP method (GET, POST, etc.) that matches what the server expects. For example, if the server endpoint is defined with `server.post("/latest-blogs")`, the frontend should use `axios.post()` not `axios.get()`.

2. **CORS Configuration**: Make sure your server has proper CORS configuration that allows the necessary HTTP methods. In `server.js`, ensure that:
   ```javascript
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
   ```

3. **Preflight Requests**: Add proper handling for OPTIONS preflight requests:
   ```javascript
   if (req.method === "OPTIONS") {
     return res.status(200).end();
   }
   ```

4. **Vercel Headers Configuration**: In your `vercel.json`, add headers configuration:
   ```json
   "headers": [
     {
       "source": "/(.*)",
       "headers": [
         { "key": "Access-Control-Allow-Credentials", "value": "true" },
         { "key": "Access-Control-Allow-Origin", "value": "*" },
         { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
         { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
       ]
     }
   ]
   ```

### 404 Not Found Errors

If you're seeing 404 errors for the main page:

1. Check that the `outputDirectory` in vercel.json is set to `frontend/dist`
2. Verify that the build process is correctly generating files in the frontend/dist directory
3. Make sure the rewrites in vercel.json are correctly configured

### API Connection Issues

If your frontend can't connect to the backend:

1. Check that the `VITE_SERVER_DOMAIN` in `.env.production` matches your Vercel app URL
2. Verify that the API routes in `vercel.json` include all the endpoints your app needs
3. Check the Vercel logs for any errors
4. Make sure CORS is properly configured in your server.js file

### Build Errors

If you encounter build errors:

1. Check that all dependencies are correctly installed
2. Verify that your package.json scripts are correct
3. Check the Vercel build logs for specific errors

## Local Development

For local development, continue using:

```bash
# Start the frontend
npm run dev:frontend

# Start the backend
npm run dev:server
```

## Important Notes

1. The server must export the Express app directly, not as a property of an object
2. All API routes must be explicitly listed in the vercel.json file
3. The frontend must use the correct server domain in production
4. Vercel's built-in Vite framework detection works best with a simpler configuration
