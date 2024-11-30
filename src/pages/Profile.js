import { useContext } from 'react';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import ResetPassword from '../components/ResetPassword';
import ProfileUpdate from '../components/ProfileUpdate';

export default function Profile() {
  const { user } = useContext(UserContext);

  const userDetails = {
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juandelacruz@mail.com',
    mobileNo: '09266772411',
  };

  return user.id === null ? (
    <Navigate to='/login' />
  ) : (
    <>
      <Row>
        <Col className='bg-primary text-white'>
          <h1 className='pt-5 my-5 mx-5'>Profile</h1>
          <h2 className='mt-5 mx-5'>
            {userDetails.firstName} {userDetails.lastName}
          </h2>
          <hr />
          <h3 className='mx-5'>Contacts</h3>
          <ul className='mx-5 pb-5'>
            <li>Email: {userDetails.email}</li>
            <li>Mobile Number: {userDetails.mobileNo}</li>
          </ul>
        </Col>
      </Row>
      <Row className='my-3'>
        <Col
          xs={12}
          md={{ span: 3, offset: 1 }}
        >
          <ProfileUpdate />
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          md={{ span: 3, offset: 1 }}
          className='mb-5'
        >
          <ResetPassword />
        </Col>
      </Row>
    </>
  );
}
