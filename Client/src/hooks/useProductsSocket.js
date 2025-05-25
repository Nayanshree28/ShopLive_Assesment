import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../api';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds
const POLLING_INTERVAL = 30000; // 30 seconds

/**
 * Subscribes to product_created / product_updated events
 * @param {(product: Object) => void} onChange
 */
export function useProductsSocket(onChange) {
  const [toast, setToast] = useState(null);
  const socketRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const pollingIntervalRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) return;
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await api.get('/products');
        onChange({ type: 'poll', products: data });
      } catch (error) {
        console.error('Polling failed:', error);
      }
    }, POLLING_INTERVAL);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const connectSocket = () => {
      if (socketRef.current?.connected) return;

      const socket = io('https://shoplive-assesment-1.onrender.com', {
        reconnection: false // We'll handle reconnection manually
      });

      socket.on('connect', () => {
        reconnectAttemptsRef.current = 0;
        stopPolling();
        showToast('Connected to real-time updates!', 'success');
      });

      socket.on('connect_error', () => {
        showToast('Connection lost. Reconnecting...', 'error');
        
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          setTimeout(connectSocket, RECONNECT_INTERVAL);
        } else {
          showToast('Falling back to polling updates', 'info');
          startPolling();
        }
      });

      socket.on('product_created', (product) => {
        onChange({ type: 'created', product });
      });

      socket.on('product_updated', (product) => {
        onChange({ type: 'updated', product });
      });

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      stopPolling();
    };
  }, [onChange]);

  return toast;
}