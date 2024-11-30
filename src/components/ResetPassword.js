import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [message, setMessage] = useState('');
  

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // if (password !== confirmPassword) {
    //   setMessage('Passwords do not match!');
    //   return;
    // }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/b6/users/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: password }),
      });

      if (response.ok) {
        // setMessage('Password reset successful!');
        setPassword('');
        setConfirmPassword('');

        Swal.fire({
          icon: 'success',
          title: 'Password reset successfully!',
          showConfirmButton: false,
          timer: 1500
        });

      } else {
        const errorData = await response.json();
        // setMessage(errorData.message);

        Swal.fire({
          title: 'Error!',
          text: errorData.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      // setMessage('An error occurred. Please try again.');
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <Form onSubmit={handleResetPassword} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">New Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </Form.Group>
        {/* {message && <Alert variant={password !== confirmPassword ? "danger" : "success"}>{message}</Alert>} */}
        <Button type="submit" variant="primary">Reset Password</Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
