# Deploying For-Everyone-Blogs to Vercel

This guide explains how to deploy the For-Everyone-Blogs project (both frontend and backend) to Vercel.

## Prerequisites

1. A Vercel account
2. Git repository with your code
3. MongoDB Atlas account with a database set up

## Deployment Steps

### 1. Push your code to a Git repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Import your project to Vercel

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Import your Git repository
4. Select the "For-Everyone-Blogs" repository

### 3. Configure the project

In the Vercel project settings:

1. **Build Command**: Leave as default (Vercel will use the `build` script from package.json)
2. **Output Directory**: Leave as default
3. **Install Command**: `npm install`

### 4. Set up Environment Variables

Add the following environment variables in the Vercel project settings:

- `MONGO_URI`: Your MongoDB connection string
- `DB_LOCATION`: Same as MONGO_URI
- `FRONTEND_URL`: Your Vercel app URL (you can add this after deployment)
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key
- `SECRET_ACCESS_KEY`: Your JWT secret key
- `VERCEL`: Set to `true`

### 5. Deploy

Click "Deploy" and wait for the build to complete.

### 6. Update CORS settings

After deployment, go back to Environment Variables and update `FRONTEND_URL` with your actual Vercel app URL.

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the build logs in Vercel
2. Make sure all dependencies are correctly installed
3. Verify that your environment variables are correctly set

### API Connection Issues

If the frontend cannot connect to the API:

1. Check that the API routes are correctly configured in `vercel.json`
2. Verify that CORS is properly set up in the server code
3. Make sure the environment variables are correctly set

## Local Development

For local development, you can still use:

```bash
npm run dev:frontend
npm run dev:server
```

## Vercel Configuration

The project uses the following Vercel configuration:

- `vercel.json`: Routes configuration for both frontend and backend
- Server API endpoint: `/api/*` routes to the Express server
- Frontend: Static files are served from the frontend build directory
