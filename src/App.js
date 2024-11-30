import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';

// Components
import NavBar from './components/Navbar';
import OrderHistory from './components/OrderHistory';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { Error } from './pages/Error';
import ProductPage from './pages/ProductPage';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      retrieveUserDetails(token);
    }
  }, []);

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/b6/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Retrieved User Data: ', data);

        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin,
        });
      });
  };

  const handleCheckout = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );
      if (response.ok) {
        // Product successfully checked out
        console.log('Product checked out successfully');
        // Optionally, you can update the UI or take further action here
      } else {
        console.error('Failed to checkout product:', response.statusText);
      }
    } catch (error) {
      console.error('Error checking out product:', error);
    }
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <NavBar />
        <Container fluid>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/products'
              element={<ProductPage handleCheckout={handleCheckout} />}
            />
            <Route path='/order-history' element={<OrderHistory />} />

            <Route
              path='/register'
              element={<Register />}
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/logout'
              element={<Logout />}
            />
            <Route
              path='/profile'
              element={<Profile />}
            />
            {user.isAdmin && (
              <Route
                path='/dashboard'
                element={<AdminDashboard />}
              />
            )}
            {user.isAdmin && (
              <Route
                path='/view-all'
                element={<AdminDashboard />}
              />
            )}
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}

            {/* Error Page */}
            <Route
              path='*'
              element={<Error />}
            />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
