import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard/ProductCard';
import { useToast } from '../context/ToastContext';
import styles from './ProductList.module.css';

const ProductList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = searchQuery?.trim()
        ? `http://localhost:5000/api/products/search?q=${encodeURIComponent(searchQuery)}`
        : `http://localhost:5000/api/products`;

      const response = await axios.get(url);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      addToast({
        message: 'Failed to load products. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]); // re-fetch on search query change

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={fetchProducts}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={`${styles.container} container`}>
        <h1 className={styles.title}>Our Products</h1>
        {products.length === 0 ? (
          <p className={styles.emptyMessage}>No products found.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductList;
