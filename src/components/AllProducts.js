import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Spinner, Alert, Button, Modal, Dropdown, } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../UserContext';

const AllProducts = React.forwardRef((props, ref) => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const prevRefreshRef = useRef();

  useEffect(() => {
    prevRefreshRef.current = refreshProducts;
  }, [refreshProducts]);

  const refreshRef = useRef();
  refreshRef.current = refreshProducts;

  const fetchAdminProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/b6/products/all`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
        setError(null);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchAdminProducts();
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user && user.id) {
          const token = localStorage.getItem('token');

          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/b6/products/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setProducts(data);
            setError(null);
          } else {
            setError('Failed to fetch products');
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const DeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/b6/products/delete/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        setError(null);
        toast.success('Product deleted successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setRefreshProducts((prev) => !prev);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete product');
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const archivingAndActivating = async (productId, isActive) => {
    try {
      const token = localStorage.getItem('token');

      const endpoint = isActive ? 'activate' : 'archive';

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/b6/products/${productId}/${endpoint}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, isActive } : product
          )
        );
        setError(null);
        toast.success(
          `Product ${isActive ? 'activated' : 'archived'} successfully`,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        setRefreshProducts((prev) => !prev);
      } else {
        const data = await response.json();
        setError(
          data.message ||
            `Failed to ${isActive ? 'activate' : 'archive'} product`
        );
        toast.error(`Failed to ${isActive ? 'activate' : 'archive'} product`);
      }
    } catch (error) {
      console.error(
        `Error ${isActive ? 'activating' : 'archiving'} product:`,
        error
      );
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    }
  };

  const openDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductIdToDelete(null);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setCurrentPage(1);
  };

  const filteredProducts = () => {
    if (filter === 'available') {
      return products.filter((product) => product.isActive);
    } else if (filter === 'notAvailable') {
      return products.filter((product) => !product.isActive);
    } else {
      return products;
    }
  };

  const totalPages = Math.ceil(filteredProducts().length / itemsPerPage);

  const paginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filtered = filteredProducts();
    console.log('Filtered Products:', filtered);
    return filtered.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  const openEditModal = (product) => {
    setEditedProduct(product);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditedProduct(null);
    setShowEditModal(false);
  };

  const handleEdit = (product) => {
    openEditModal(product);
  };

  const EditProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/b6/products/${editedProduct._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedProduct),
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === editedProduct._id ? editedProduct : p
          )
        );
        setError(null);
        toast.success('Product edited successfully', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setRefreshProducts((prev) => !prev);
        closeEditModal();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to edit product');
        toast.error('Failed to edit product');
      }
    } catch (error) {
      console.error('Error editing product:', error);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    }
  };

  React.useImperativeHandle(ref, () => ({
    refreshProducts: async () => {
      try {
        setRefreshProducts((prev) => !prev);
      } catch (error) {
        console.error('Error refreshing products:', error);
      }
    },
  }));

  if (loading) {
    return (
      <Spinner
        animation='border'
        role='status'
      >
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant='danger'>{error}</Alert>;
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center my-3'>
        <h1>Product List</h1>
        <Dropdown
          onSelect={(selectedFilter) => handleFilterChange(selectedFilter)}
        >
          <Dropdown.Toggle
            variant='success'
            id='dropdown-basic'
          >
            Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey='all'>All Products</Dropdown.Item>
            <Dropdown.Item eventKey='available'>Available</Dropdown.Item>
            <Dropdown.Item eventKey='notAvailable'>Not Available</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className='row'>
        {paginatedProducts().map((product, index) => (
          <div
            key={product._id}
            className={`col-md-6 mb-3${
              index % 2 === 0 ? ' pr-md-2' : ' pl-md-2'
            }`}
          >
            <Table
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th colSpan='2'>Product Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td
                    className='text-truncate'
                    style={{ maxWidth: '150px' }}
                  >
                    {product.name}
                  </td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td
                    className='text-truncate'
                    style={{ maxWidth: '150px' }}
                  >
                    {product.description}
                  </td>
                </tr>
                <tr>
                  <td>Price</td>
                  <td>${product.price}</td>
                </tr>
                <tr>
                  <td>Quantity</td>
                  <td>{product.quantity}</td>
                </tr>
                <tr>
                  <td>Availability</td>
                  <td>
                    <span
                      className={
                        product.isActive ? 'text-success' : 'text-danger'
                      }
                    >
                      {product.isActive ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Action</td>
                  <td>
                    <Button
                      variant='info'
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      variant='danger'
                      onClick={() => openDeleteModal(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>Set Availability</td>
                  <td>
                    <Button
                      variant={product.isActive ? 'danger' : 'success'}
                      onClick={() =>
                        archivingAndActivating(product._id, !product.isActive)
                      }
                    >
                      {product.isActive ? 'Archive' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </div>

      <div className='d-flex justify-content-between align-items-center mt-3'>
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <Button
            variant='secondary'
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Back
          </Button>{' '}
          <Button
            variant='secondary'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        show={showEditModal}
        onHide={closeEditModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className='form-group'>
              <label htmlFor='productName'>Name:</label>
              <input
                type='text'
                id='productName'
                className='form-control'
                value={editedProduct?.name || ''}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className='form-group'>
              <label htmlFor='productDescription'>Description:</label>
              <textarea
                id='productDescription'
                className='form-control'
                value={editedProduct?.description || ''}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className='form-group'>
              <label htmlFor='productPrice'>Price:</label>
              <input
                type='text'
                id='productPrice'
                className='form-control'
                value={editedProduct?.price || ''}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
              />
            </div>
            <div className='form-group'>
              <label htmlFor='productQuantity'>Quantity:</label>
              <input
                type='number'
                id='productQuantity'
                className='form-control'
                value={editedProduct?.quantity || ''}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={closeEditModal}
          >
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={EditProduct}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={closeDeleteModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={closeDeleteModal}
          >
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => DeleteProduct(productIdToDelete)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
});

export default AllProducts;
