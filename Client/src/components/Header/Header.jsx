import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

const Header = ({ socketStatus, onSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); // 🔥 Send to parent (Home)
  };

  const getStatusColor = () => {
    switch (socketStatus) {
      case 'connected':
        return 'var(--color-success)';
      case 'reconnecting':
        return 'var(--color-warning)';
      default:
        return 'var(--color-error)';
    }
  };

  const getStatusText = () => {
    switch (socketStatus) {
      case 'connected':
        return 'Live';
      case 'reconnecting':
        return 'Reconnecting...';
      default:
        return 'Offline (polling)';
    }
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.logo}>
            ShopLive
          </Link>

          <div className={styles.navLinks}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/add-product" 
              className={`${styles.navLink} ${location.pathname === '/add-product' ? styles.active : ''}`}
            >
              Add Product
            </Link>
          </div>

          <form 
            className={`${styles.searchForm} ${isSearchFocused ? styles.focused : ''}`}
            onSubmit={handleSearch}
          >
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              aria-label="Search products"
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton} aria-label="Submit search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          <div className={styles.statusIndicator} title={getStatusText()}>
            <motion.div
              className={styles.statusDot}
              style={{ backgroundColor: getStatusColor() }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="visually-hidden">{getStatusText()}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 