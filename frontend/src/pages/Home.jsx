import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Package, Sparkles, ShoppingBag, Tag, CheckCircle2, XCircle } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser') || 'User');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('mern-authentication-llk2.vercel.app/api/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      // Handles both array responses and structured { data: [...] } responses
      if (Array.isArray(result)) {
        setProducts(result);
      } else if (result.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      handleError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      {/* Background Multi-Color Ambient Blobs */}
      <div style={{ ...styles.glowBlob, ...styles.blobPink }} />
      <div style={{ ...styles.glowBlob, ...styles.blobCyan }} />
      <div style={{ ...styles.glowBlob, ...styles.blobPurple }} />

      {/* Main Glassmorphic Dashboard Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={styles.card}
      >
        {/* Navigation Bar / Top Header */}
        <div style={styles.topBar}>
          <div style={styles.userInfo}>
            <div style={styles.userBadge}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <span style={styles.welcomeText}>Welcome back,</span>
              <h1 style={styles.userName}>{loggedInUser}</h1>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </div>

        {/* Section Header */}
        <div style={styles.sectionHeader}>
          <ShoppingBag size={22} color="#38bdf8" />
          <h2 style={styles.sectionTitle}>Available Products</h2>
        </div>

        {/* Product List Content */}
        {loading ? (
          <div style={styles.emptyState}>
            <p style={{ color: '#94a3b8' }}>Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <Package size={48} color="#64748b" />
            <p style={{ color: '#94a3b8', marginTop: '12px' }}>No products found</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((item, index) => (
              <motion.div
                key={item.id || index}
                whileHover={{ y: -4, borderColor: '#38bdf8' }}
                style={styles.productCard}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.iconBox}>
                    <Package size={22} color="#c084fc" />
                  </div>
                  {item.inStock !== undefined && (
                    <div style={styles.stockStatus}>
                      {item.inStock ? (
                        <CheckCircle2 size={16} color="#4ade80" />
                      ) : (
                        <XCircle size={16} color="#f87171" />
                      )}
                    </div>
                  )}
                </div>

                <h3 style={styles.productName}>{item.name}</h3>

                {item.category && (
                  <span style={styles.categoryBadge}>
                    <Tag size={12} style={{ marginRight: '4px' }} />
                    {item.category}
                  </span>
                )}

                <div style={styles.cardFooter}>
                  <span style={styles.priceLabel}>Price</span>
                  <span style={styles.priceValue}>${item.price?.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  glowBlob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(120px)',
    pointerEvents: 'none',
    opacity: 0.35,
  },
  blobPink: {
    top: '-80px',
    left: '-80px',
    width: '400px',
    height: '400px',
    background: '#ec4899',
  },
  blobCyan: {
    top: '30%',
    right: '-100px',
    width: '450px',
    height: '450px',
    background: '#06b6d4',
  },
  blobPurple: {
    bottom: '-80px',
    left: '20%',
    width: '400px',
    height: '400px',
    background: '#a855f7',
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '36px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    zIndex: 10,
    boxSizing: 'border-box',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '28px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
    boxShadow: '0 8px 16px rgba(236, 72, 153, 0.25)',
  },
  welcomeText: {
    fontSize: '12px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  userName: {
    fontSize: '24px',
    fontWeight: '800',
    margin: '0',
    background: 'linear-gradient(to right, #f472b6, #c084fc, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '10px 18px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '18px',
  },
  productCard: {
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  iconBox: {
    padding: '8px',
    borderRadius: '10px',
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
  },
  productName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: '0 0 6px 0',
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '4px 8px',
    borderRadius: '6px',
    width: 'fit-content',
    marginBottom: '16px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#38bdf8',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
  },
};

export default Home;