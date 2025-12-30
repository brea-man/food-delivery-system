const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const MenuItem = require('../models/menuItem.model');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'customer' },
        { model: Restaurant, as: 'restaurant' },
        { model: OrderItem, as: 'orderItems', include: [{ model: MenuItem, as: 'menuItem' }] }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get orders by customer
const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Restaurant, as: 'restaurant' },
        { model: OrderItem, as: 'orderItems', include: [{ model: MenuItem, as: 'menuItem' }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer' },
        { model: Restaurant, as: 'restaurant' },
        { model: OrderItem, as: 'orderItems', include: [{ model: MenuItem, as: 'menuItem' }] }
      ]
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Check if user has permission to view this order
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { restaurant_id, items, deliveryAddress, special_instructions, payment_method } = req.body;
    const userId = req.user.id;

    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });
      }
      total_amount += menuItem.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId: userId,
      restaurantId: restaurant_id,
      totalAmount: total_amount,
      deliveryAddress: deliveryAddress || "Default Address",
      status: 'pending'
    });

    // Create order items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      await OrderItem.create({
        orderId: order.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Fetch complete order
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'customer' },
        { model: Restaurant, as: 'restaurant' },
        { model: OrderItem, as: 'orderItems', include: [{ model: MenuItem, as: 'menuItem' }] }
      ]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: 'restaurant' }]
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'restaurant_owner' && order.restaurant.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'rider' && !['ready', 'picked_up', 'delivered'].includes(status)) {
      return res.status(403).json({ message: 'Rider can only update to ready, picked_up, or delivered' });
    }

    await order.update({ status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Get orders by restaurant
const getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { restaurantId: req.params.restaurantId },
      include: [
        { model: User, as: 'customer' },
        { model: OrderItem, as: 'orderItems', include: [{ model: MenuItem, as: 'menuItem' }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Check if user has permission
    if (req.user.role === 'restaurant_owner') {
      const restaurant = await Restaurant.findByPk(req.params.restaurantId);
      if (restaurant.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrdersByCustomer,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrdersByRestaurant
};
