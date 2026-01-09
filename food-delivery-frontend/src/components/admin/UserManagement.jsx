import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Sample data for demonstration
    const sampleUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', phone: '+1234567890', joinDate: '2023-01-15', orders: 25 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Restaurant', status: 'Active', phone: '+1234567891', joinDate: '2023-02-20', orders: 0 },
      { id: 3, name: 'Bob ', email: 'bob@example.com', role: 'Delivery', status: 'Active', phone: '+1234567892', joinDate: '2023-03-10', orders: 150 },
      { id: 4, name: 'Alice ', email: 'alice@example.com', role: 'Customer', status: 'Inactive', phone: '+1234567893', joinDate: '2023-04-05', orders: 10 },
      { id: 5, name: 'Charlie ', email: 'charlie@example.com', role: 'Admin', status: 'Active', phone: '+1234567894', joinDate: '2023-05-12', orders: 0 }
    ];
    setUsers(sampleUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.joinDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.orders.toString().includes(searchTerm);

    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="section">
        <h2>User Management</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2>User Management</h2>
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
      <h2>User Management</h2>
      <div className="search-filter-container">
        <input
  type="text"
  placeholder="Search"
  value={searchTerm}
  disabled
  className="search-input"
/>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="user-table">
        <div className="table-header">
          <span>ID</span>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Phone</span>
          <span>Join Date</span>
        
        </div>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <span>{user.id}</span>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <span className={`status-badge status-${user.status.toLowerCase()}`}>{user.status}</span>
              <span>{user.phone}</span>
              <span>{user.joinDate}</span>
             
            </div>
          ))
        ) : (
          <div className="table-row">
            <span colSpan="8" className="no-results">No users found matching your search.</span>
          </div>
        )}
      </div>
    </div>
  );
}
