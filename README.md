# For Everyone Blogs

A full-stack blogging platform built with React, Node.js, Express, and MongoDB.

## Project Structure

- `frontend/`: React application built with Vite
- `server/`: Node.js/Express backend API

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/For-Everyone-Blogs.git
   cd For-Everyone-Blogs
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

3. Set up environment variables:
   - Create a `.env` file in the `server/` directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     AWS_ACCESS_KEY=your_aws_access_key
     AWS_SECRET_KEY=your_aws_secret_key
     AWS_BUCKET_NAME=your_aws_bucket_name
     AWS_REGION=your_aws_region
     ```

4. Start the development servers:
   - For the backend:
     ```
     npm run dev:server
     ```
   - For the frontend:
     ```
     npm run dev:frontend
     ```

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Import your project in the Vercel dashboard

3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install:all`

4. Add environment variables in the Vercel dashboard:
   - Add all the environment variables from your `.env` file
   - Add `FRONTEND_URL` with your frontend deployment URL

5. Deploy

## Features

- User authentication (signup, signin)
- Create, read, update, and delete blog posts
- Rich text editor for writing blog posts
- Image upload to AWS S3
- Trending blogs section
- User profiles
- Comments and replies
- Notifications

## Technologies Used

### Frontend
- React
- Vite
- React Router
- Editor.js
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- AWS S3 for image storage

## License

This project is licensed under the MIT License.
