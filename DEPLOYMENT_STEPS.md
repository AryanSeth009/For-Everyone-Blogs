# Deployment Steps for For-Everyone-Blogs on Vercel

Follow these steps to deploy your For-Everyone-Blogs project on Vercel:

## 1. Push your code to GitHub

Make sure all your changes are committed and pushed to your GitHub repository.

## 2. Set up your project on Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: frontend/dist

## 3. Set up environment variables

Add these environment variables in the Vercel project settings:

- `MONGO_URI`: Your MongoDB connection string
- `DB_LOCATION`: Same as MONGO_URI
- `FRONTEND_URL`: https://for-everyone-blogs.vercel.app
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key
- `NODE_ENV`: production

## 4. Deploy

Click "Deploy" and wait for the build to complete.

## 5. Verify the deployment

1. Visit your deployed site
2. Check that both the frontend and backend are working
3. Test login, blog creation, and other features

## Troubleshooting

If you encounter issues with the API connection:

1. Check the Vercel logs for any errors
2. Verify that the environment variables are set correctly
3. Make sure the API routes are properly configured in vercel.json
4. Check that CORS is properly set up in the server code

## Local Development

For local development, continue using:

```bash
# Start the frontend
npm run dev:frontend

# Start the backend
npm run dev:server
```
