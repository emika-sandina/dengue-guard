// import React state tools
import React, { useState } from 'react';
// import url routing controls
import { useNavigate } from 'react-router-dom';
// import Supabase database client
import { supabase } from '../../lib/supabaseClient';
// import brand logo graphic
import shieldLogo from '../../assets/shieldsvg.svg';
import './auth.css';
import Dropdown from '../../components/common/Dropdown/Dropdown';
import Toast from '../../components/common/Toast/Toast';

// set backend API path via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthPage = () => {
  // initialize state variables
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mohArea, setmohArea] = useState(null);
  
  // configure toast notification system state
  const [toastMsg, setToastMsg] = useState({ message: '', type: '' });
  
  // function to trigger visual toast alerts
  const showToast = (message, type, duration = 5000) => {
    setToastMsg({ message, type, duration });
  };
  
  // create a useNavigate() object to allow redirecting to other pages
  const navigate = useNavigate();

  // handle user form submission logic
  const handleAuth = async (e) => {
    // prevent default page reload behavior
    e.preventDefault();

    // validate required input fields
    if (!email.trim() || !password.trim() || (!isLogin && !fullName.trim())) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    // validate standard email string format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please include an '@' and '.' in your email address.", "error");
      return;
    }

    // validate minimum password length
    if (!isLogin && password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    // enable loading spinner state
    setLoading(true);

    try {
      if (isLogin) {
        // hit custom proxy API for internal login flow
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        // throw custom error on backend failure
        if (!response.ok) throw new Error(data.error || 'Login failed');

        // assign session variables into local storage mapping
        localStorage.setItem('dgToken', data.token);
        localStorage.setItem('dgUser', JSON.stringify(data.user));
        if (data.user && data.user.role) {
          localStorage.setItem('dgUserRole', data.user.role);
        }

        // redirect authenticated user safely according to database role
        if (data.user.role === 'moh') navigate('/moh/home');
        else navigate('/citizen/home');

      } else {
        // bypass backend calling Supabase auth module natively for signups
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              moh_area: mohArea ? mohArea.value : null
            }
          }
        });
        
        // break process if Supabase registers an error
        if (error) throw error;
        
        // issue positive user feedback prompt
        showToast('Check your email for the confirmation link!', 'success', 8000);
        
        // clear old submission data from state
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (error) {
      // output network failure conditions
      showToast(error.message || 'Authentication failed', 'error');
    } finally {
      // disable network loading variable
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={shieldLogo} alt="DengueGuard Logo" className="auth-logo" />
        {/* toggle dynamic heading based on active view mode */}
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>

        {/* attach custom modular alert mechanism */}
        <Toast
          message={toastMsg.message}
          type={toastMsg.type}
          duration={toastMsg.duration}
          onClose={() => setToastMsg({ message: '', type: '' })}
        />

        <form onSubmit={handleAuth} className="auth-form" noValidate>
          {/* dynamically render extra fields solely during registration sequence */}
          {!isLogin && (
            <>
              <div className="auth-input-group">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="auth-input-group">
                <label>Select MOH Area</label>
                {/* load standardized dropdown component mapping localized areas */}
                <Dropdown value={mohArea} onChange={setmohArea} />
              </div>
            </>
          )}
          <div className="auth-input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* adjust button wording based on active UI flow */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="auth-toggle">
          {/* invert logic phrasing for toggle switch */}
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          {/* swap the react status when text is activated */}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;