import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import CreateProduct from '../components/CreateProduct';
import AllProducts from '../components/AllProducts';

const AdminDashboard = ({ productsData }) => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("view-all");

  const addProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setActiveTab("view-all");
  };

  useEffect(() => {
    
    console.log("Products Data:", productsData);
    if (productsData) {
      setProducts(productsData);
    }
  }, [productsData]);

  return (
    <Container className='mt-5'>
      <Tabs activeKey={activeTab} id="admin-dashboard-tabs" onSelect={(key) => setActiveTab(key)}>
        <Tab eventKey="view-all" title="View All Products">
          <AllProducts products={products} />
        </Tab>
        <Tab eventKey="create" title="Create Product">
          <CreateProduct addProduct={addProduct} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
