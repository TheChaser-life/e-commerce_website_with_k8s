import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Navigate, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>E-commerce Shop</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            {isLoggedIn ? (
              <button type="button" onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <Link to="/register">Register</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/products"
              element={(
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Products />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/cart"
              element={(
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Cart />
                </ProtectedRoute>
              )}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
