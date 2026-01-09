import { useState, useEffect } from 'react';

export default function CommissionPricing() {
  const [commissions, setCommissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRate, setEditRate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommission, setNewCommission] = useState({
    type: '',
    rate: '',
    icon: '',
    description: ''
  });

  useEffect(() => {
    // Sample data for demonstration
    const sampleCommissions = [
      { id: 1, type: 'Delivery Fee', rate: 10, icon: '🚚', description: 'Fee charged for delivery services' },
      { id: 2, type: 'Service Charge', rate: 5, icon: '💼', description: 'Platform service maintenance fee' }
      ];
    setCommissions(sampleCommissions);
  }, []);

  const handleEdit = (commission) => {
    setEditingId(commission.id);
    setEditRate(commission.rate);
  };

  const handleSave = (id) => {
    setCommissions(commissions.map(commission =>
      commission.id === id ? { ...commission, rate: parseFloat(editRate) } : commission
    ));
    setEditingId(null);
    setEditRate('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditRate('');
  };

  const handleAddNew = () => {
    if (newCommission.type && newCommission.rate && newCommission.description) {
      const newId = Math.max(...commissions.map(c => c.id)) + 1;
      setCommissions([...commissions, {
        id: newId,
        ...newCommission,
        rate: parseFloat(newCommission.rate),
        icon: newCommission.icon || '💰'
      }]);
      setNewCommission({ type: '', rate: '', icon: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id) => {
    setCommissions(commissions.filter(commission => commission.id !== id));
  };

  return (
    <div className="section">
      <div className="commission-header">
        <h2>Commission & Pricing</h2>
        <button
          className="add-commission-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Commission'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-commission-form">
          <h3>Add New Commission Type</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Commission Type (e.g., Delivery Fee)"
              value={newCommission.type}
              onChange={(e) => setNewCommission({...newCommission, type: e.target.value})}
            />
            <input
              type="number"
              placeholder="Rate (%)"
              value={newCommission.rate}
              onChange={(e) => setNewCommission({...newCommission, rate: e.target.value})}
              step="0.1"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={newCommission.icon}
              onChange={(e) => setNewCommission({...newCommission, icon: e.target.value})}
            />
            <input
              type="text"
              placeholder="Description"
              value={newCommission.description}
              onChange={(e) => setNewCommission({...newCommission, description: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button className="save-btn" onClick={handleAddNew}>Add Commission</button>
            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="commission-grid">
        {commissions.map(commission => (
          <div key={commission.id} className="commission-card">
            <div className="commission-icon">{commission.icon}</div>
            <h3>{commission.type}</h3>

            {editingId === commission.id ? (
              <div className="edit-rate-section">
                <input
                  type="number"
                  value={editRate}
                  onChange={(e) => setEditRate(e.target.value)}
                  step="0.1"
                  min="0"
                  max="100"
                  className="rate-input"
                />
                <span className="percent-symbol">%</span>
                <div className="edit-actions">
                  <button className="save-btn" onClick={() => handleSave(commission.id)}>Save</button>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <p className="commission-rate">{commission.rate}%</p>
            )}

            <div className="commission-details">
              <span>{commission.description}</span>
            </div>
           

            {editingId !== commission.id && (
              <div className="commission-actions">
                <button className="edit-btn" onClick={() => handleEdit(commission)}>Edit Rate</button>
                <button className="delete-btn" onClick={() => handleDelete(commission.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
