import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const TestAuth = () => {
  const [authToken, setAuthToken] = useState('');
  const [userData, setUserData] = useState({});
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    // Get auth token and user data from localStorage
    const token = localStorage.getItem('authToken');
    const userDataStr = localStorage.getItem('userData');
    
    setAuthToken(token || 'No token found');
    
    try {
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      } else {
        setUserData({ error: 'No user data found' });
      }
    } catch (error) {
      setUserData({ error: `Error parsing user data: ${error.message}` });
    }
  }, []);

  const testAuthEndpoint = async () => {
    try {
      setTestResult('Testing...');
      
      const response = await fetch('http://localhost:4000/api/reviews/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Authentication Test Page</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h2>Auth Token</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {authToken}
          </pre>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h2>User Data</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
        
        <button 
          onClick={testAuthEndpoint}
          style={{
            padding: '10px 15px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Auth Endpoint
        </button>
        
        {testResult && (
          <div style={{ marginTop: '20px' }}>
            <h2>Test Result</h2>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAuth;