import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Container, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const authenticate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/b6/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log('Server response:', data);

      // Inside the authenticate function, after successful login and before redirection
      if (response.ok && data.access) {
        localStorage.setItem('token', data.access);
        retrieveUserDetails(data.access);

        setLoginError(null);
        setIsActive(false);

        Swal.fire({
          title: "You've successfully logged in!",
          icon: 'success',
          text: 'Welcome back!',
          showConfirmButton: false,
          timer: 1500,
        });

        // Check if the logged-in user is an admin
        if (user.isAdmin) {
          // Redirect to the dashboard if the user is an admin
          navigate('/dashboard');
        } else {
          // Redirect to the home page for non-admin users
          navigate('/');
        }
      } else {
        setLoginError('Log in failed! Check your login details and try again.');
        Swal.fire({
          title: 'Error!',
          text: 'Log in failed! Check your login details and try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);

      setLoginError('An unexpected error occurred. Please try again later.');

      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    setEmail('');
    setPassword('');
  };

  const retrieveUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/b6/users/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser({
          id: data.user.id,
          isAdmin: data.user.isAdmin,
        });
      } else {
        console.error('Error retrieving user details:', data);
      }
    } catch (error) {
      console.error('Error during user details retrieval:', error);
    }
  };

  useEffect(() => {
    setIsActive(email !== '' && password !== '');
  }, [email, password]);

  return user.id !== null ? (
    <Navigate to='/' />
  ) : (
    <Container className='my-5 pt-5'>
      <Col
        xs={12}
        md={{ span: 6, offset: 3 }}
      >
        <Form
          onSubmit={(e) => authenticate(e)}
          className='shadow p-5 mb-5 bg-white rounded'
        >
          <h1 className='text-center mb-4'>Login</h1>

          {loginError && <Alert variant='danger'>{loginError}</Alert>}

          <Form.Group className='pb-3'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='pb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {isActive ? (
            <Button
              variant='primary'
              type='submit'
              id='submitBtn'
            >
              Submit
            </Button>
          ) : (
            <Button
              variant='danger'
              type='submit'
              id='submitBtn'
              disabled
            >
              Submit
            </Button>
          )}
        </Form>
      </Col>
    </Container>
  );
}
