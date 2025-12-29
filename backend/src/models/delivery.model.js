const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Delivery = sequelize.define('Delivery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'delivered'),
    defaultValue: 'pending'
  },
  assignedAt: {
    type: DataTypes.DATE
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryPersonId: {
    type: DataTypes.INTEGER
  }
});

module.exports = Delivery;