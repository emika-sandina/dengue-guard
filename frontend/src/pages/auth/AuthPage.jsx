import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import shieldLogo from '../../assets/shieldsvg.svg';
import './auth.css';
import Dropdown from '../../components/common/Dropdown/Dropdown';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mohArea, setmohArea] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In via Professional Backend API
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');

        // Save token and minimal user data for our ProtectedRoutes and Pages
        localStorage.setItem('dgToken', data.token);
        localStorage.setItem('dgUser', JSON.stringify(data.user));
        if (data.user && data.user.role) {
          localStorage.setItem('dgUserRole', data.user.role);
        }

        // Redirect based on role
        if (data.user.role === 'moh') navigate('/moh/home');
        else navigate('/citizen/home');

      } else {
        // Sign Up (Triggers our DB function to set role to citizen)
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
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={shieldLogo} alt="DengueGuard Logo" className="auth-logo" />
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>

        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
            <>
              <div className="auth-input-group">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
          <div className="auth-input-group">
            <label>Select MOH Area</label>
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
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;