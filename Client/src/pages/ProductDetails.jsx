import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { addToast } = useToast();

  const fallbackImage = 'https://via.placeholder.com/600x400?text=No+Image';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://shoplive-assesment-1.onrender.com/api/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details');
        addToast({
          message: 'Failed to load product details. Please try again later.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, addToast]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          <div className={styles.skeletonContainer}>
            <div className={`${styles.skeletonImage} skeleton`} />
            <div className={styles.skeletonContent}>
              <div className={`${styles.skeletonTitle} skeleton`} />
              <div className={`${styles.skeletonPrice} skeleton`} />
              <div className={`${styles.skeletonDescription} skeleton`} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>Product not found</p>
            <button
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={`${styles.container} container`}>
        <motion.div
          className={styles.productContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.imageContainer}>
            <img
              src={imageError ? fallbackImage : product.image}
              alt={product.name}
              className={styles.image}
              onError={handleImageError}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p className={styles.description}>{product.description}</p>
            <button
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              Back to Products
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default ProductDetails;