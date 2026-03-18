import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      try {
        const token = localStorage.getItem('dgToken');
        const userStr = localStorage.getItem('dgUser');
        
        if (!token || !userStr) {
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