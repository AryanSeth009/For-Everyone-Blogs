// API Configuration
const DEFAULT_API_DOMAIN = 'https://for-everyone-blogs.vercel.app';
const ENV_API_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

// Check if the environment variable contains a placeholder
const containsPlaceholder = (url) => {
  return url && (
    url.includes('your-vercel-app-name') || 
    url.includes('your-app-name') ||
    url.includes('placeholder')
  );
};

// Use the environment variable if it's set and doesn't contain a placeholder
// Otherwise, fall back to the default API domain
const API_DOMAIN = containsPlaceholder(ENV_API_DOMAIN) ? DEFAULT_API_DOMAIN : (ENV_API_DOMAIN || DEFAULT_API_DOMAIN);

// Log the API domain being used
console.log('API Domain:', API_DOMAIN);
console.log('Environment variable VITE_SERVER_DOMAIN:', ENV_API_DOMAIN);
if (containsPlaceholder(ENV_API_DOMAIN)) {
  console.warn('WARNING: Environment variable contains placeholder text. Using default API domain instead.');
}

// Export the API domain for use in components
export const getApiDomain = () => {
  return API_DOMAIN;
};

// Export a function to check if the API domain is valid
export const validateApiDomain = () => {
  if (containsPlaceholder(ENV_API_DOMAIN)) {
    console.error('ERROR: API Domain contains placeholder text');
    return false;
  }
  return true;
};
