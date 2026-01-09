import { useState } from 'react';
import UserManagement from '../../components/admin/UserManagement';
import RestaurantApproval from '../../components/admin/RestaurantApproval';
import DeliveryAgentManagement from '../../components/admin/DeliveryAgentManagement';
import OrderMonitoring from '../../components/admin/OrderMonitoring';
import CommissionPricing from '../../components/admin/CommissionPricing';
import ReportsAnalytics from '../../components/admin/ReportsAnalytics';
import '../../assets/panel.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊', description: 'View key metrics and statistics' },
    { id: 'userManagement', label: 'User', icon: '👥', description: 'Manage users, roles, and permissions' },
    { id: 'restaurantApproval', label: 'Restaurant', icon: '🍽️', description: 'Approve and manage restaurants' },
    { id: 'deliveryAgentManagement', label: 'Driver', icon: '🚚', description: 'Manage delivery personnel' },
    { id: 'orderMonitoring', label: 'Order ', icon: '📦', description: 'Track and manage orders' },
    { id: 'commissionPricing', label: 'Commission', icon: '💰', description: 'Set commissions and pricing' },
    { id: 'reportsAnalytics', label: 'Reports', icon: '📈', description: 'View detailed reports and analytics' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'userManagement':
        return <UserManagement />;
      case 'restaurantApproval':
        return <RestaurantApproval />;
      case 'deliveryAgentManagement':
        return <DeliveryAgentManagement />;
      case 'orderMonitoring':
        return <OrderMonitoring />;
      case 'commissionPricing':
        return <CommissionPricing />;
      case 'reportsAnalytics':
        return <ReportsAnalytics />;
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => {
    const notifications = [
      { id: 1, message: 'New restaurant registration pending approval', time: '2 hours ago', type: 'info' },
      { id: 2, message: 'Order #1234 requires immediate attention', time: '1 hour ago', type: 'warning' },
      { id: 3, message: 'Monthly revenue target achieved', time: '30 minutes ago', type: 'success' },
      { id: 4, message: 'New delivery agent joined the platform', time: '15 minutes ago', type: 'info' },
    ];

    if (showNotifications) {
      return (
        <div className="section">
          <div className="notification-header">
            <h2>All Notifications</h2>
            <button onClick={() => setShowNotifications(false)} className="close-button">
              ✕
            </button>
          </div>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="list-item">
                <div className="list-item-details">
                  <div className="list-item-info">{notification.message}</div>
                  <div className="list-item-secondary">{notification.time}</div>
                </div>
                <span className={`status-badge status-${notification.type === 'warning' ? 'pending' : notification.type === 'success' ? 'approved' : 'active'}`}>
                  {notification.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="section">
        <h2>Admin Dashboard</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3><img src="/users.svg" alt="Users" style={{ width: '24px', height: '24px', marginRight: '8px' }} /> Total Users</h3>
            <p className="metric">1,234</p>
            <span className="trend positive">+12% this month</span>
          </div>
          <div className="overview-card">
            <h3><img src="/restaurant.svg" alt="Restaurants" style={{ width: '24px', height: '24px', marginRight: '8px' }} /> Active Restaurants</h3>
            <p className="metric">567</p>
            <span className="trend positive">+8% this month</span>
          </div>
          <div className="overview-card">
            <h3><img src="/orders.svg" alt="Orders" style={{ width: '24px', height: '24px', marginRight: '8px' }} /> Orders Today</h3>
            <p className="metric">89</p>
            <span className="trend positive">+15% vs yesterday</span>
          </div>
          <div className="overview-card">
            <h3><img src="/revenue.svg" alt="Revenue" style={{ width: '24px', height: '24px', marginRight: '8px' }} /> Revenue</h3>
            <p className="metric">$12,345</p>
            <span className="trend positive">+22% this month</span>
          </div>
        </div>
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => setShowNotifications(true)} className="quick-action-btn">
              🔔 View Notifications ({notifications.length})
            </button>
            <button onClick={() => setActiveSection('userManagement')} className="quick-action-btn">
              👤 Manage Users
            </button>
            <button onClick={() => setActiveSection('restaurantApproval')} className="quick-action-btn">
              <img src="/restaurant.svg" alt="Restaurant" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              Approve Restaurants
            </button>
            <button onClick={() => setActiveSection('orderMonitoring')} className="quick-action-btn">
              📋 View Orders
            </button>
            <button onClick={() => setActiveSection('reportsAnalytics')} className="quick-action-btn">
              📊 View Reports
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className={`sidepanel ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidepanel-header">
          <h1>Admin</h1>
          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => setActiveSection(item.id)}
              title={sidebarCollapsed ? item.description : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
      <div className="main-content">
        {renderSection()}
      </div>
    </div>
  );
}
