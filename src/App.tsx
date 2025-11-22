import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Info from './pages/Info';
import Cart from './pages/Cart';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: '#56514f' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/info" element={<Info />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}