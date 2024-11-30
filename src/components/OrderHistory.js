import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/b6/orders/myOrders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user orders:', data);
        setOrders(data);
      } else {
        console.error('Failed to fetch user orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  return (
    <div>
      <h2>Order History</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            {/* Display order details here */}
            Order ID: {order._id}, Total: {order.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
