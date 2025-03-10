# Setting Up Environment Variables in Vercel

Environment variables are crucial for your application to work correctly in production. Based on the errors you're seeing, the `VITE_SERVER_DOMAIN` environment variable is not being correctly set during the build process.

## Steps to Configure Environment Variables in Vercel

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

## Verifying Environment Variables

After redeploying, you can verify that your environment variables are correctly set by:

1. Opening your deployed application
2. Opening the browser developer tools (F12)
3. Looking at the console logs from the debug component we added

You should see:
```
API Domain: https://for-everyone-blogs.vercel.app
Environment variables in the browser:
VITE_SERVER_DOMAIN: https://for-everyone-blogs.vercel.app
```

If you still see the placeholder URL (`https://your-vercel-app-name.vercel.app`), it means the environment variables are not being correctly applied during the build process.

## Additional Troubleshooting

If setting environment variables in the Vercel dashboard doesn't resolve the issue:

1. **Check your `.gitignore` file** to ensure `.env.production` is not being ignored during deployment
2. **Add environment variables directly in the build command**:
   - Go to Settings > General > Build & Development Settings
   - Modify the build command to: `VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app npm run build`

3. **Try using Vercel CLI for deployment** with environment variables:
   ```bash
   vercel --env VITE_SERVER_DOMAIN=https://for-everyone-blogs.vercel.app
   ```

Remember that after making these changes, you'll need to redeploy your application for them to take effect.
