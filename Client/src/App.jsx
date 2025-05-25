import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header/Header';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import './styles/globals.css';

const App = () => {
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate socket connection status for demo
    const statuses = ['connected', 'reconnecting', 'disconnected'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setSocketStatus(statuses[currentIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <ToastProvider>
        <div className="app">
          <Header socketStatus={socketStatus} onSearch={setSearchQuery}  />
          <Routes>
          <Route path="/" element={<ProductList searchQuery={searchQuery} />} />

            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/add-product" element={<CreateProduct />} />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;