import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, Sparkles } from 'lucide-react';
import { handleError, handleSuccess } from '../utils';

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('All fields are required');
    }

    setLoading(true);
    try {
      const url = "https://mern-authentication-llk2.vercel.app/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => navigate("/home"), 1000);
      } else if (error) {
        const details = error?.details[0]?.message || 'Validation failed';
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Multi-Color Glowing Background Blobs */}
      <div style={{ ...styles.glowBlob, ...styles.blobPink }} />
      <div style={{ ...styles.glowBlob, ...styles.blobCyan }} />
      <div style={{ ...styles.glowBlob, ...styles.blobPurple }} />

      {/* Main Glassmorphic Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={styles.card}
      >
        {/* Header Section */}
        <div style={styles.header}>
          <motion.div whileHover={{ rotate: 12, scale: 1.1 }} style={styles.badge}>
            <Sparkles size={28} color="#ffffff" />
          </motion.div>
          
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Log in to continue your journey</p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={{
              ...styles.label,
              color: focusedInput === 'email' ? '#38bdf8' : '#94a3b8'
            }}>
              Email Address
            </label>
            <div style={styles.inputWrapper}>
              <Mail 
                size={20} 
                style={{
                  ...styles.inputIcon,
                  color: focusedInput === 'email' ? '#38bdf8' : '#64748b'
                }} 
              />
              <input
                onChange={handleChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginInfo.email}
                style={{
                  ...styles.input,
                  borderColor: focusedInput === 'email' ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  boxShadow: focusedInput === 'email' ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={{
              ...styles.label,
              color: focusedInput === 'password' ? '#c084fc' : '#94a3b8'
            }}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <Lock 
                size={20} 
                style={{
                  ...styles.inputIcon,
                  color: focusedInput === 'password' ? '#c084fc' : '#64748b'
                }} 
              />
              <input
                onChange={handleChange}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={loginInfo.password}
                style={{
                  ...styles.input,
                  paddingRight: '45px',
                  borderColor: focusedInput === 'password' ? '#c084fc' : 'rgba(255,255,255,0.1)',
                  boxShadow: focusedInput === 'password' ? '0 0 15px rgba(192, 132, 252, 0.3)' : 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(236, 72, 153, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Login</span>
                <LogIn size={20} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.signupLink}>
            Sign up now
          </Link>
        </div>
      </motion.div>

      <ToastContainer theme="dark" />
    </div>
  );
};

// Pure CSS Stylesheet Object
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070913',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  glowBlob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)',
    pointerEvents: 'none',
    opacity: 0.4
  },
  blobPink: {
    top: '-50px',
    left: '-50px',
    width: '300px',
    height: '300px',
    background: '#ec4899'
  },
  blobCyan: {
    top: '40%',
    right: '-50px',
    width: '350px',
    height: '350px',
    background: '#06b6d4'
  },
  blobPurple: {
    bottom: '-50px',
    left: '30%',
    width: '300px',
    height: '300px',
    background: '#a855f7'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '36px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    zIndex: 10,
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
    boxShadow: '0 10px 20px rgba(236, 72, 153, 0.3)',
    marginBottom: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '0',
    background: 'linear-gradient(to right, #f472b6, #c084fc, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    transition: 'color 0.2s ease'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    pointerEvents: 'none',
    transition: 'color 0.2s ease'
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    color: '#f8fafc',
    padding: '14px 14px 14px 44px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(to right, #ec4899, #8b5cf6, #06b6d4)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    transition: 'all 0.3s ease'
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#94a3b8'
  },
  signupLink: {
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #f472b6, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
    marginLeft: '6px'
  }
};

export default Login;