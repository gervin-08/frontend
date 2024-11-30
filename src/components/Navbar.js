import React, { useContext } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLink, Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function NavBar() {
  const { user } = useContext(UserContext);

  const handleNavLinkClick = () => {
    const navbarToggle = document.getElementById('basic-navbar-nav');
    if (navbarToggle) {
      navbarToggle.classList.remove('show');
    }
  };

  return (
    <Navbar bg="dark" expand="lg" className="mb-0">
      <Container fluid>
        <Navbar.Brand as={Link} to="" onClick={handleNavLinkClick}  style={{ color: 'white' }}>
          ShopLifting
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='bg-light border-0'/>
        <Navbar.Collapse id="basic-navbar-nav" onSelect={handleNavLinkClick}>
          <Nav className="mx-auto">
            <Form inline className="d-flex">
              <FormControl type="text" placeholder="Search" className="mr-sm-2 mx-2" size="sm"  style={{ width: "500px" }} />
              <Button className="ml-2">
                <i className="bi bi-search"></i>
              </Button>
            </Form>
          </Nav>
          <Nav className="ms-auto">
            {user.id !== null ? (
              user.isAdmin ? (
                <>
                  <Nav.Link as={Link} to="/profile" onClick={handleNavLinkClick} style={{ color: 'white' }}>Profile</Nav.Link>
                  <Nav.Link as={Link} to="/dashboard" onClick={handleNavLinkClick} style={{ color: 'white' }}>Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/logout"  onClick={handleNavLinkClick} style={{ color: 'white' }}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/" onClick={handleNavLinkClick} style={{ color: 'white' }}>Home</Nav.Link>
                  <Nav.Link as={Link} to="/profile" onClick={handleNavLinkClick} style={{ color: 'white' }}>Profile</Nav.Link>
                  <Nav.Link as={NavLink} to="/products" onClick={handleNavLinkClick} style={{ color: 'white' }}>Products</Nav.Link>
                  <Nav.Link as={Link} to="/cart" onClick={handleNavLinkClick} style={{ color: 'white' }}>Cart</Nav.Link>                      
                  <Nav.Link as={Link} to="/logout"  onClick={handleNavLinkClick} style={{ color: 'white' }}>Logout</Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link as={NavLink} to="/" onClick={handleNavLinkClick} style={{ color: 'white' }}>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products" onClick={handleNavLinkClick} style={{ color: 'white' }}>Products</Nav.Link>
                <Nav.Link as={Link} to="/login"  onClick={handleNavLinkClick} style={{ color: 'white' }}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={handleNavLinkClick} style={{ color: 'white' }}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
