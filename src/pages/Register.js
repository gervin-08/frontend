import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
  const { user } = useContext(UserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword &&
      mobileNo.length === 11
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  function registerUser(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/b6/users/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.emailExists) {
          console.error(data);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email already exists!',
          });
        } else {
          fetch(`${process.env.REACT_APP_API_URL}/b6/users/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              lastName,
              mobileNo,
              email,
              password,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);

              if (data.message === 'Registered Successfully!') {
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobileNo('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                  icon: 'success',
                  title: 'Registered successfully! Please Log in',
                  showConfirmButton: false,
                  timer: 1500,
                });

                navigate('/login');
              } else if (data.error === 'Email invalid') {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Email is invalid!',
                });
              } else if (data.error === 'Mobile number invalid') {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Mobile number is invalid!',
                });
              } else if (
                data.error === 'Password must be at least 8 characters'
              ) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Password must be at least 8 characters!',
                });
              } else {
                console.error(data);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                });
              }
            });
        }
      })
      .catch((error) => {
        console.error('Error checking email existence:', error);
      });
  }

  return user.id !== null ? (
    <Navigate to='/' />
  ) : (
    <Container>
      <Col
        xs={12}
        md={{ span: 6, offset: 3 }}
        lg={{ span: 4, offset: 4 }}
        className='mb-5'
      >
        <h1 className='my-5 text-center'>Register</h1>
        <Row className='justify-content-center shadow p-5 mb-3 bg-white custom-border-radius'>
          <Form onSubmit={(e) => registerUser(e)}>
            {/* First Name */}
            <Form.Group className='mb-3'>
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter First Name'
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </Form.Group>
            {/* Last Name */}
            <Form.Group className='my-3'>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Last Name'
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Form.Group>
            {/* Email */}
            <Form.Group className='my-3'>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter Email'
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            {/* Mobile Number */}
            <Form.Group className='my-3'>
              <Form.Label>Mobile No:</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter 11 Digit number'
                required
                value={mobileNo}
                onChange={(e) => {
                  setMobileNo(e.target.value);
                }}
              />
            </Form.Group>
            {/* Password */}
            <Form.Group className='my-3'>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Password'
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            {/* Confirm Password */}
            <Form.Group className='my-3'>
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm Password'
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Form.Group>
            {/* Button */}
            {isActive ? (
              <Button
                variant='primary'
                type='submit'
              >
                Submit
              </Button>
            ) : (
              <Button
                variant='danger'
                type='submit'
                disabled
              >
                Submit
              </Button>
            )}
          </Form>
        </Row>
      </Col>
    </Container>
  );
};

export default Register;
