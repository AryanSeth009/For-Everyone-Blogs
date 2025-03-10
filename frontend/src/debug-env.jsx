import React, { useEffect, useState } from 'react';
import { getApiDomain, validateApiDomain } from './api-config';
import axios from 'axios';

const DebugEnv = () => {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiError, setApiError] = useState(null);
  
  useEffect(() => {
    console.log('Environment variables in the browser:');
    console.log('VITE_SERVER_DOMAIN:', import.meta.env.VITE_SERVER_DOMAIN);
    console.log('API Domain from config:', getApiDomain());
    
    // Check if API domain is valid
    const isValid = validateApiDomain();
    if (!isValid) {
      setApiError('API domain contains placeholder text');
    }
    
    // Test API connection
    const testApiConnection = async () => {
      try {
        setApiStatus('Testing connection...');
        
        // Try to fetch trending blogs as a simple test
        const response = await axios.get(`${getApiDomain()}/trending-blogs`);
        
        if (response.data && response.status === 200) {
          setApiStatus('Connected successfully!');
          console.log('API test response:', response.data);
        } else {
          setApiStatus('Connected but received unexpected response');
          setApiError(`Status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
        }
      } catch (error) {
        setApiStatus('Connection failed');
        setApiError(error.message);
        console.error('API connection test failed:', error);
      }
    };
    
    testApiConnection();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px', margin: '20px', border: '1px solid #ddd' }}>
      <h2>API Configuration Debug</h2>
      <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      <p><strong>API URL from env:</strong> <code>{import.meta.env.VITE_SERVER_DOMAIN || 'Not set'}</code></p>
      <p><strong>API URL from config:</strong> <code>{getApiDomain()}</code></p>
      <p><strong>API Status:</strong> <span style={{ color: apiStatus === 'Connected successfully!' ? 'green' : 'red' }}>{apiStatus}</span></p>
      {apiError && (
        <div style={{ backgroundColor: '#ffeeee', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          <p><strong>Error:</strong> {apiError}</p>
        </div>
      )}
      <div style={{ marginTop: '15px' }}>
        <small>This debug panel is only visible in development mode and should be removed before production deployment.</small>
      </div>
    </div>
  );
};

export default DebugEnv;
