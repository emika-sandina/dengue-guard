import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Basic JWT expiration check using the `exp` claim.
// Returns true if the token is expired or malformed.
const isTokenExpired = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }
    const payloadJson = atob(parts[1]);
    const payload = JSON.parse(payloadJson);
    if (!payload || typeof payload.exp !== 'number') {
      // If there is no exp claim, treat the token as non-expiring.
      return false;
    }
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowInSeconds;
  } catch (e) {
    // Any error while decoding should treat the token as invalid/expired.
    return true;
  }
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      try {
        const token = localStorage.getItem('dgToken');
        const userStr = localStorage.getItem('dgUser');

        // If there is no token/user info or the token is expired/invalid,
        // clear any stored auth state and treat as unauthenticated.
        if (!token || !userStr || isTokenExpired(token)) {
          localStorage.removeItem('dgToken');
          localStorage.removeItem('dgUser');
          setAuthenticated(false);
          setUserRole(null);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        setAuthenticated(true);
        setUserRole(user.role);
      } catch (err) {
        console.error("Auth security check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [allowedRole]);

  // While checking the session, show a loading screen or spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
        <h3>Verifying access...</h3>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required but doesn't match, redirect to login
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the protected page
  return children;
};

export default ProtectedRoute;