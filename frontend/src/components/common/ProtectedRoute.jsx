import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// function to verify if the provided JWT is expired based on 'exp' epoch
const isTokenExpired = (token) => {
  try {
    // split JWT into header, payload, and signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }
    
    // decode the payload from base64 string safely
    const payloadJson = atob(parts[1]);
    const payload = JSON.parse(payloadJson);
    
    // if there is no expiration claim, mark non-expiring
    if (!payload || typeof payload.exp !== 'number') {
      return false;
    }
    
    // compare payload UNIX timestamp against current time
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowInSeconds;
  } catch (e) {
    // default to expired on parse errors
    return true;
  }
};

// wrapper component defining authorization barriers for private pages
const ProtectedRoute = ({ children, allowedRole }) => {
  // initialize state variables for auth sequence
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // use effect hook to load and verify local user session on mount
  useEffect(() => {
    const checkUser = () => {
      try {
        // read stored credentials from local storage
        const token = localStorage.getItem('dgToken');
        const userStr = localStorage.getItem('dgUser');

        // wipe data entirely if token is missing, invalid, or expired
        if (!token || !userStr || isTokenExpired(token)) {
          localStorage.removeItem('dgToken');
          localStorage.removeItem('dgUser');
          setAuthenticated(false);
          setUserRole(null);
          setLoading(false);
          return;
        }

        // assign active session variables
        const user = JSON.parse(userStr);
        setAuthenticated(true);
        setUserRole(user.role);
      } catch (err) {
        console.error("Auth security check failed:", err);
      } finally {
        // turn off loading spinner flag
        setLoading(false);
      }
    };

    checkUser();
  }, [allowedRole]);

  // render loading spinner view while validating
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
        <h3>Verifying access...</h3>
      </div>
    );
  }

  // replace non-authenticated users seamlessly via Navigate routing
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // redirect to login if User misses explicit role authority
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // successfully render restricted component
  return children;
};

export default ProtectedRoute;