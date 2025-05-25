import { useEffect } from 'react';
import '../styles.css';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span>{message}</span>
        <button onClick={onClose} className="toast-close">&times;</button>
      </div>
    </div>
  );
} 