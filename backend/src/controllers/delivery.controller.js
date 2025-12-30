const Delivery = require('../models/delivery.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');

// Get all deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'customer' }] },
        { model: User, as: 'rider' }
      ]
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries', error: error.message });
  }
};

// Get delivery by ID
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'customer' }] },
        { model: User, as: 'rider' }
      ]
    });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery', error: error.message });
  }
};

// Assign delivery to rider
const assignDelivery = async (req, res) => {
  try {
    const { rider_id } = req.body;
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    await delivery.update({
      deliveryPersonId: rider_id,
      status: 'assigned'
    });

    const updatedDelivery = await Delivery.findByPk(req.params.id, {
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'customer' }] },
        { model: User, as: 'rider' }
      ]
    });

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery', error: error.message });
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Check if rider is updating their own delivery
    if (req.user.role === 'rider' && delivery.deliveryPersonId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this delivery' });
    }

    await delivery.update({
      status,
      current_location: location
    });

    // Update order status based on delivery status
    if (status === 'picked_up') {
      await Order.update({ status: 'out_for_delivery' }, { where: { id: delivery.order_id } });
    } else if (status === 'delivered') {
      await Order.update({ status: 'delivered' }, { where: { id: delivery.order_id } });
    }

    const updatedDelivery = await Delivery.findByPk(req.params.id, {
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'customer' }] },
        { model: User, as: 'rider' }
      ]
    });

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error: error.message });
  }
};

// Get deliveries by rider
const getDeliveriesByRider = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      where: { deliveryPersonId: req.user.id },
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'customer' }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rider deliveries', error: error.message });
  }
};

// Get available deliveries for assignment
const getAvailableDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      where: { status: 'pending' },
      include: [
        { model: Order, as: 'order', include: [{ model: User, as: 'customer' }] }
      ]
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available deliveries', error: error.message });
  }
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  assignDelivery,
  updateDeliveryStatus,
  getDeliveriesByRider,
  getAvailableDeliveries
};
