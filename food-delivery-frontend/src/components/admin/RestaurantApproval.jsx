import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function RestaurantApproval() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Sample data for demonstration
    const sampleRestaurants = [
      { id: 1, name: 'Pizza Palace', location: 'Downtown', phone: '+1-555-0101', owner: 'John ', approved: true },
      { id: 2, name: 'Burger Barn', location: 'Midtown', phone: '+1-555-0102', owner: 'Jane ', approved: false },
      { id: 3, name: 'Taco Town', location: 'East Side', phone: '+1-555-0103', owner: 'Carlos ', approved: true },
      { id: 4, name: 'Sushi Spot', location: 'West End', phone: '+1-555-0104', owner: 'Akira ', approved: false },
      { id: 5, name: 'Pasta Place', location: 'North District', phone: '+1-555-0105', owner: 'Maria ', approved: true }
    ];
    setRestaurants(sampleRestaurants);
    setLoading(false);
  }, []);

  const approveRestaurant = async (id) => {
    try {
      await api.post(`/admin/restaurants/${id}/approve`);
      setRestaurants(restaurants.map(r => r.id === id ? { ...r, approved: true } : r));
    } catch (error) {
      console.error('Error approving restaurant:', error);
      alert('Failed to approve restaurant. Please try again.');
    }
  };

  const rejectRestaurant = async (id) => {
    try {
      await api.post(`/admin/restaurants/${id}/reject`);
      setRestaurants(restaurants.map(r => r.id === id ? { ...r, approved: false, rejected: true } : r));
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      alert('Failed to reject restaurant. Please try again.');
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'approved' && restaurant.approved) ||
      (filterStatus === 'pending' && !restaurant.approved);
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (approved) => {
    return (
      <span className={`status-badge ${approved ? 'status-approved' : 'status-pending'}`}>
        {approved ? 'Approved' : 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="section">
        <h2>Restaurant Approval</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2>Restaurant Approval</h2>
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
      <h2>Restaurant Approval</h2>
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="approved">rejected</option>
        </select>
      </div>
      <div className="user-table">
        <div className="table-header">
          <span>ID</span>
          <span>Name</span>
          <span>Location</span>
          <span>Phone</span> 
          <span>Owner</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="table-row">
              <span>{restaurant.id}</span>
              <span>{restaurant.name}</span>
              <span>{restaurant.location}</span>
              <span>{restaurant.phone}</span>
              <span>{restaurant.owner}</span>
              <span className={`status-badge ${restaurant.approved ? 'status-approved' : 'status-pending'}`}>
                {restaurant.approved ? 'Approved' : 'Pending'}
              </span>
              <span>
                {!restaurant.approved && (
                  <select
                    className="action-dropdown"
                    defaultValue=""
                    onChange={(e) => {
                      const action = e.target.value;
                      if (action === 'approve') {
                        approveRestaurant(restaurant.id);
                      } else if (action === 'reject') {
                        rejectRestaurant(restaurant.id);
                      }
                      e.target.value = ''; // Reset dropdown after action
                    }}
                  >
                    <option value="" disabled>Select Action</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>
                )}
              </span>
            </div>
          ))
        ) : (
          <div className="table-row">
            <span colSpan="9" className="no-results">No restaurants found matching your criteria.</span>
          </div>
        )}
      </div>
    </div>
  );
}
