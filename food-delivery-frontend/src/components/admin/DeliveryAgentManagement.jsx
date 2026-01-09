import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const Map = ({ location }) => {
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>Location: {location}</p>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>Click below to view on Google Maps</p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#4285f4',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default function DeliveryAgentManagement() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [locationTracking, setLocationTracking] = useState(false);

  useEffect(() => {
    // Sample data for demonstration
    const sampleAgents = [
      { id: 1, name: 'Mike Joh', status: 'available', rating: 4.8, location: 'Downtown', phone:'(555)123-4567', vehicle: 'Bike' },
      { id: 2, name: 'Sarah Da', status: 'busy', rating: 4.6, location: 'Uptown', phone:'(555)234-5678', vehicle: 'Car' },
      { id: 3, name: 'Tom Wilson', status: 'offline', rating: 4.9, location: 'Midtown',phone:'(555)345-6789', vehicle: 'Scooter' },
      { id: 4, name: 'Lisa Brown', status: 'active', rating: 4.7, location: 'Suburb',phone:'(555)456-7890', vehicle: 'Bike' },
      { id: 5, name: 'David Lee', status: 'available', rating: 4.5, location: 'Downtown', phone:'(555)567-8901', vehicle: 'Car' },
      { id: 6, name: 'me', status: 'available', rating: 5.0, location: 'Central Park', phone:'(555)000-0000', vehicle: 'Bike' }
    ];
    setAgents(sampleAgents);
    setLoading(false);
  }, []);

  // Geolocation tracking for online agents
  useEffect(() => {
    let watchId;

    const trackLocation = async () => {
      if (navigator.geolocation && locationTracking) {
        try {
          // Check if we have permission
          const permission = await navigator.permissions.query({ name: 'geolocation' });

          if (permission.state === 'denied') {
            setError('Location access denied. Please enable location permissions in your browser settings.');
            setLocationTracking(false);
            return;
          }

          watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude, accuracy } = position.coords;
              const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`;

              // Update the location of online agents (available, active, busy)
              setAgents(prevAgents =>
                prevAgents.map(agent => {
                  if (['available', 'active', 'busy'].includes(agent.status.toLowerCase())) {
                    return { ...agent, location: locationString };
                  }
                  return agent;
                })
              );

              // Clear any previous errors
              setError(null);
            },
            (error) => {
              console.error('Error getting location:', error);
              let errorMessage = 'Unable to access location. ';

              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage += 'Please enable location permissions in your browser.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage += 'Location information is unavailable.';
                  break;
                case error.TIMEOUT:
                  errorMessage += 'Location request timed out.';
                  break;
                default:
                  errorMessage += 'Please check your device settings.';
                  break;
              }

              setError(errorMessage);
              setLocationTracking(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000
            }
          );
        } catch (err) {
          console.error('Permission check failed:', err);
          setError('Unable to check location permissions. Please ensure your browser supports geolocation.');
          setLocationTracking(false);
        }
      }
    };

    if (locationTracking) {
      trackLocation();
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locationTracking]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status.toLowerCase() === filterStatus;
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
    const statuses = [...new Set(agents.map(agent => agent.status.toLowerCase()))];
    return statuses;
  };

  const handleLocationClick = (agent) => {
    setSelectedAgent(agent);
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
    setSelectedAgent(null);
  };

  if (loading) {
    return (
      <div className="section">
        <h2>Delivery Agent Management</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading delivery agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2>Delivery Agent Management</h2>
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
      <h2>Delivery Agent Management</h2>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search"
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
        <button
          onClick={() => setLocationTracking(!locationTracking)}
          className={`location-tracking-btn ${locationTracking ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            backgroundColor: locationTracking ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          {locationTracking ? 'Stop Location Tracking' : 'Start Location Tracking'}
        </button>
      </div>
      <div className="user-table">
        <div className="table-header">
          <span>ID</span>
          <span>Name</span>
          <span>Status</span>
          <span>Rating</span>
          <span>Location</span>
          <span>Phone</span>
          <span>Vehicle</span>
        </div>
        {filteredAgents.length > 0 ? (
          filteredAgents.map(agent => (
            <div key={agent.id} className="table-row">
              <span>{agent.id}</span>
              <span>{agent.name}</span>
              <span className={`status-badge status-${agent.status.toLowerCase()}`}>{agent.status}</span>
              <span>{agent.rating || 'N/A'}</span>
              <span onClick={() => handleLocationClick(agent)} style={{ cursor: 'pointer', color: 'blue' }}>{agent.location || 'N/A'}</span>
              <span>{agent.phone || 'N/A'}</span>
              <span>{agent.vehicle || 'N/A'}</span>
            </div>
          ))
        ) : (
          <div className="table-row">
            <span colSpan="7" className="no-results">No delivery agents found matching your criteria.</span>
          </div>
        )}
      </div>
      {showMap && selectedAgent && (
        <div className="map-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '80%', height: '80%' }}>
            <h3>Location of {selectedAgent.name}</h3>
            <Map location={selectedAgent.location} />
            <button onClick={closeMap} style={{ marginTop: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
