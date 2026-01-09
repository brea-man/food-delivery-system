import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function OrderMonitoring() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Sample data for demonstration
    const sampleOrders = [
      { id: 1, customer: 'John Doe', restaurant: 'Pizza Palace', status: 'delivered', total: 25.99, date: '2024-01-15' },
      { id: 2, customer: 'Jane Smith', restaurant: 'Burger Barn', status: 'preparing', total: 18.50, date: '2024-01-15' },
      { id: 3, customer: 'Bob Johnson', restaurant: 'Taco Town', status: 'pending', total: 12.75, date: '2024-01-15' },
      { id: 4, customer: 'Alice Brown', restaurant: 'Sushi Spot', status: 'confirmed', total: 32.00, date: '2024-01-15' },
      { id: 5, customer: 'Charlie Wilson', restaurant: 'Pasta Place', status: 'picked', total: 22.45, date: '2024-01-15' }
    ];
    setOrders(sampleOrders);
    setLoading(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(orders.map(order => order.status.toLowerCase()))];
    return statuses;
  };

  if (loading) {
    return (
      <div className="section">
        <h2>Order Monitoring</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2>Order Monitoring</h2>
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Order Monitoring</h2>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search "
          value={searchTerm}
          disabled
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          {getUniqueStatuses().map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="user-table">
        <div className="table-header">
          <span>ID</span>
          <span>Customer</span>
          <span>Restaurant</span>
          <span>Status</span>
          <span>Total</span>
          <span>Date</span>
        </div>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="table-row">
              <span>{order.id}</span>
              <span>{order.customer || 'N/A'}</span>
              <span>{order.restaurant || 'N/A'}</span>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
              <span>${order.total || 'N/A'}</span>
              <span>{order.date || 'N/A'}</span>
            </div>
          ))
        ) : (
          <div className="table-row">
            <span colSpan="6" className="no-results">No orders found matching your criteria.</span>
          </div>
        )}
      </div>
    </div>
  );
}
