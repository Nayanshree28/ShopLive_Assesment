import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import styles from './CreateProduct.module.css';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Animate form fields with errors
      const errorFields = document.querySelectorAll('[data-error="true"]');
      errorFields.forEach((field) => {
        field.classList.add(styles.shake);
        setTimeout(() => field.classList.remove(styles.shake), 400);
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://shoplive-assesment-1.onrender.com/api/products', {
        ...formData,
        price: parseFloat(formData.price),
      });
      
      addToast({
        message: 'Product created successfully!',
        type: 'success',
      });
      
      navigate('/');
    } catch (err) {
      addToast({
        message: err.response?.data?.message || 'Failed to create product',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.container} container`}>
        <motion.div
          className={styles.formContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className={styles.title}>Add New Product</h1>
          
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                data-error={!!errors.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className={styles.errorMessage} id="name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                rows="4"
                data-error={!!errors.description}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p className={styles.errorMessage} id="description-error">
                  {errors.description}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`${styles.input} ${errors.price ? styles.error : ''}`}
                data-error={!!errors.price}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? 'price-error' : undefined}
              />
              {errors.price && (
                <p className={styles.errorMessage} id="price-error">
                  {errors.price}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`${styles.input} ${errors.image ? styles.error : ''}`}
                data-error={!!errors.image}
                aria-invalid={!!errors.image}
                aria-describedby={errors.image ? 'image-error' : undefined}
              />
              {errors.image && (
                <p className={styles.errorMessage} id="image-error">
                  {errors.image}
                </p>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loader} />
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default CreateProduct; 