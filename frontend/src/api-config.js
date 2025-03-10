// API Configuration
const API_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN || 'https://for-everyone-blogs.vercel.app';

// Log the API domain being used
console.log('API Domain:', API_DOMAIN);

// Export the API domain for use in components
export const getApiDomain = () => {
  return API_DOMAIN;
};

// Export a function to check if the API domain is valid
export const validateApiDomain = () => {
  if (API_DOMAIN.includes('your-vercel-app-name')) {
    console.error('ERROR: API Domain contains placeholder text "your-vercel-app-name"');
    return false;
  }
  return true;
};
