import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ProductPage = () => {
  const [activeProducts, setActiveProducts] = useState([]);

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/b6/products/`);
        if (response.ok) {
          const data = await response.json();
          setActiveProducts(data);
        } else {
          console.error('Failed to fetch active products');
        }
      } catch (error) {
        console.error('Error fetching active products:', error);
      }
    };

    fetchActiveProducts();
  }, []);

  const handleCheckout = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/b6/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        console.log('Product checked out successfully', productId);
        Swal.fire({
          title: 'You have checked out a product!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error('Failed to checkout product:', response.statusText);
        Swal.fire({
          title: 'Failed to checkout product',
          text: response.statusText,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error checking out product:', error);
      Swal.fire({
        title: 'Error checking out product',
        text: error.message,
        icon: 'error',
      });
    }
  };

  return (
    <Container className='product-page'>
      <h1 className='text-center my-4'>Explore Our Products</h1>
      <Row>
        {activeProducts.map((product) => (
          <Col
            key={product._id}
            md={4}
            className='my-4'
          >
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Price: ₱ {product.price}</Card.Text>
                <Button variant='success' className='me-2 border border-dark' onClick={() => handleCheckout(product._id)}>Checkout</Button>
                <Button variant='primary' className='border border-dark'>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductPage;
