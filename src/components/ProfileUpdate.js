import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function ProfileUpdate() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  // const [message, setMessage] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleMobileNoChange = (event) => {
    setMobileNo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/b6/users/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          mobileNo: mobileNo,
        }),
      });
      const data = await response.json();

      if(data.message === "Profile updated successfully!"){
        // setMessage('Profile updated successfully!');
        setFirstName('');
        setLastName('');
        setMobileNo('');
        
        Swal.fire({
            icon: 'success',
            title: 'Profile updated successfully!',
            showConfirmButton: false,
            timer: 1500
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
            Swal.fire({
            title: 'Error!',
            text: "Failed to update profile",
            icon: 'error',
        });
    }
  };

  return (
    <div className='my-5'>
    <h2>Update Profile</h2>
    <Form onSubmit={handleSubmit} className='mt-5'>
      <Form.Group className="mb-3" controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={handleFirstNameChange}
          placeholder="Enter your first name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={handleLastNameChange}
          placeholder="Enter your last name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formMobileNo">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="text"
          value={mobileNo}
          onChange={handleMobileNoChange}
          placeholder="Enter your mobile number"
          required
        />
      </Form.Group>
      {/* {message && <Alert variant="success">{message}</Alert>} */}
      <Button variant="primary" type="submit">
        Update
      </Button>
    </Form>
  </div>
  );
}

export default ProfileUpdate;
