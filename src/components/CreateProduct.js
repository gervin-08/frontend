import React, { useState } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateProduct = ({ addProduct }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/b6/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();
      addProduct(newProduct);

      Swal.fire({
        icon: 'success',
        title: 'Product created successfully',
        showConfirmButton: false,
        timer: 1500
      });

      setProductData({
        name: '',
        description: '',
        price: '',
        quantity: ''
      });
      
      setTimeout(() => {
        navigate('/view-all');
      }, 1000);

    } catch (error) {
      console.error('Error creating product:', error.message);
      toast.error('Failed to create product', {
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
    <ToastContainer />
    <Container className='pt-5'>
      <Col lg={{ span: 8, offset: 2 }}>
        <Form onSubmit={handleSubmit} className='shadow p-5 mb-5 bg-light-subtle rounded'>
          <Form.Group controlId="productName">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter product name" 
              name="name"
              value={productData.name} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group controlId="productDescription" className='mt-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              placeholder="Enter product description" 
              name="description"
              value={productData.description} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group controlId="productPrice" className='mt-3'>
            <Form.Label>Price</Form.Label>
            <Form.Control 
              type="" 
              placeholder="Enter product price" 
              name="price"
              value={productData.price} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group controlId="productQuantity" className='mt-3'>
            <Form.Label>Quantity</Form.Label>
            <Form.Control 
              type='number' 
              placeholder="Enter product quantity" 
              name="quantity"
              value={productData.quantity} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Button variant="primary" type="submit" className='mt-4'>
            Create Product
          </Button>
        </Form>
      </Col>
    </Container>
    </>
  );
};

export default CreateProduct;
