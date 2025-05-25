import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, index }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <Link to={`/product/${product._id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={imageError ? fallbackImage : product.image}
            alt={product.name}
            className={styles.image}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{product.name}</h2>
          <p className={styles.price}>
            ${product.price.toFixed(2)}
          </p>
          <p className={styles.description}>
            {product.description.length > 100
              ? `${product.description.slice(0, 100)}...`
              : product.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard; 