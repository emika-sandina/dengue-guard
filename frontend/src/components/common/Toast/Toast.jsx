import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'error', duration = 5000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (duration > 0 && !isPaused && message) {
      const timer = setTimeout(() => handleDismiss(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isPaused, message]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for the exit animation to finish before calling onClose
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300);
  };

  if (!message) return null;

  const icons = {
    error: (
      <svg className="toast-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    ),
    success: (
      <svg className="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    warning: (
      <svg className="toast-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
  };

  return (
    <div className="toast-container fixed-position" aria-live="polite">
      <div
        className={`dg-toast ${type} ${isExiting ? 'exiting' : ''}`}
        role={type === 'error' ? 'alert' : 'status'}
        aria-live={type === 'error' ? 'assertive' : 'polite'}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="toast-icon-wrapper">
          {icons[type]}
        </div>
        <p className="toast-message">{message}</p>
        <button
          onClick={handleDismiss}
          className="toast-close"
          aria-label="Close notification"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
