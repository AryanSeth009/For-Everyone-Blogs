# For Everyone Blogs - Server

This is the backend server for the For Everyone Blogs application.

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_aws_bucket_name
   AWS_REGION=your_aws_region
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Deployment to Vercel

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

5. Set up environment variables in the Vercel dashboard:
   - Go to your project settings
   - Add the same environment variables as in your `.env` file
   - Add `FRONTEND_URL` with your frontend deployment URL

## API Endpoints

- `POST /signup`: Register a new user
- `POST /signin`: Login a user
- `GET /get-upload-url`: Get a pre-signed URL for uploading to S3
- `POST /create-blog`: Create a new blog post
- `GET /trending-blogs`: Get trending blog posts
- `GET /search`: Search for blogs
- And more...

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- AWS S3 for image storage
- JWT for authentication
