const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const Order = require('../models/order.model');
const Delivery = require('../models/delivery.model');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await User.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ]
    });

    const [restaurantCount] = await Restaurant.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ]
    });

    const [orderCount] = await Order.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ]
    });

    const [totalRevenue] = await Order.findAll({
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'total']
      ]
    });

    const stats = {
      totalUsers: userCount.get('count'),
      totalRestaurants: restaurantCount.get('count'),
      totalOrders: orderCount.get('count'),
      totalRevenue: totalRevenue.get('total') || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: rows,
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Approve or reject restaurant
const updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.update({ status });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant status', error: error.message });
  }
};

// Get all restaurants with pagination
const getRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Restaurant.findAndCountAll({
      include: [{ model: User, as: 'owner' }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      restaurants: rows,
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};

// Get all orders with pagination
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      include: [
        { model: User, as: 'customer' },
        { model: Restaurant, as: 'restaurant' }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      orders: rows,
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get delivery statistics
const getDeliveryStats = async (req, res) => {
  try {
    const [pendingDeliveries] = await Delivery.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { status: 'pending' }
    });

    const [inProgressDeliveries] = await Delivery.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { status: 'picked_up' }
    });

    const [completedDeliveries] = await Delivery.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { status: 'delivered' }
    });

    res.json({
      pending: pendingDeliveries.get('count'),
      inProgress: inProgressDeliveries.get('count'),
      completed: completedDeliveries.get('count')
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery stats', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateRestaurantStatus,
  getRestaurants,
  getOrders,
  getDeliveryStats
};
