import { useState, useEffect } from 'react';
import api from '../../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

export default function ReportsAnalytics() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    // Sample data for demonstration
    const sampleReports = [
      { id: 1, title: 'Monthly Sales Report', category: 'sales', data: { totalSales: 125000, orders: 2500 }, date: '2024-01-15', icon: '📊', status: 'completed' },
      { id: 2, title: 'Order Statistics', category: 'orders', data: { totalOrders: 3200, avgOrderValue: 28.50 }, date: '2024-01-15', icon: '📦', status: 'completed' },
      { id: 3, title: 'User Registration Trends', category: 'users', data: { newUsers: 450, activeUsers: 1200 }, date: '2024-01-15', icon: '👥', status: 'pending' },
      { id: 4, title: 'Performance Metrics', category: 'performance', data: { avgDeliveryTime: 25, customerSatisfaction: 4.6 }, date: '2024-01-15', icon: '⚡', status: 'completed' },
      { id: 5, title: 'Financial Summary', category: 'financial', data: { revenue: 98000, expenses: 45000 }, date: '2024-01-15', icon: '💰', status: 'completed' }
    ];
    setReports(sampleReports);
    setLoading(false);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || report.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getCategoryBadge = (category) => {
    return (
      <span className={`category-badge category-${category.toLowerCase()}`}>
        {category}
      </span>
    );
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(reports.map(report => report.category))];
    return categories;
  };

  const formatData = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  };

  if (loading) {
    return (
      <div className="section">
        <h2>Reports & Analytics</h2>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2>Reports & Analytics</h2>
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = getUniqueCategories().map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: reports.filter(r => r.category === category).length,
    color: category === 'sales' ? '#8884d8' : category === 'orders' ? '#82ca9d' : category === 'users' ? '#ffc658' : category === 'performance' ? '#ff7300' : '#00ff00'
  }));

  const salesData = [
    { month: 'Jan', sales: 120000, orders: 2400 },
    { month: 'Feb', sales: 135000, orders: 2700 },
    { month: 'Mar', sales: 118000, orders: 2360 },
    { month: 'Apr', sales: 142000, orders: 2840 },
    { month: 'May', sales: 138000, orders: 2760 },
    { month: 'Jun', sales: 125000, orders: 2500 }
  ];

  const userData = [
    { month: 'Jan', newUsers: 320, activeUsers: 950 },
    { month: 'Feb', newUsers: 380, activeUsers: 1100 },
    { month: 'Mar', newUsers: 420, activeUsers: 1250 },
    { month: 'Apr', newUsers: 450, activeUsers: 1200 },
    { month: 'May', newUsers: 480, activeUsers: 1350 },
    { month: 'Jun', newUsers: 520, activeUsers: 1400 }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="section">
      <h2>Reports & Analytics</h2>

      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <h3>Analytics Overview</h3>

        <div className="charts-grid">
          {/* Category Distribution Pie Chart */}
          <div className="chart-card">
            <h4>Report Categories Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Trend Line Chart */}
          <div className="chart-card">
            <h4>Monthly Sales & Orders Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales ($)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth Area Chart */}
          <div className="chart-card">
            <h4>User Growth Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#8884d8" fill="#8884d8" name="New Users" />
                <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics Bar Chart */}
          <div className="chart-card">
            <h4>Performance Metrics</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { metric: 'Avg Delivery Time', value: 25, target: 30 },
                { metric: 'Customer Satisfaction', value: 4.6, target: 4.5 },
                { metric: 'Order Accuracy', value: 98.5, target: 95 },
                { metric: 'Response Time', value: 2.3, target: 5 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Current" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search reports"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {getUniqueCategories().map(category => (
            <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="reports-grid">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <div key={report.id} className={`report-card ${expandedReport === report.id ? 'expanded' : ''}`}>
              <div className="report-left">
                <div className="report-header">
                  <div className="report-icon">{report.icon}</div>
                  {getCategoryBadge(report.category)}
                  <h3 className="report-title">{report.title}</h3>
                </div>
                <div className="report-summary">
                  <p>Date: {report.date || 'N/A'}</p>
                  <p>Key Metrics: {Object.keys(report.data).length} items</p>
                </div>
                <div className="report-status">
                  <span className={`status-${report.status}`}>{report.status}</span>
                </div>
                <button
                  onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                  className="view-details-button"
                >
                  {expandedReport === report.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              {expandedReport === report.id && (
                <div className="report-details-expanded">
                  <div className="report-details-header">
                    <h4>Detailed Report Data</h4>
                    <button
                      onClick={() => setExpandedReport(null)}
                      className="close-details-button"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="report-details-content">
                    <pre className="json-data">{formatData(report.data)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            No reports found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
