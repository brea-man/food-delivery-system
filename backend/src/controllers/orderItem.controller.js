const OrderItem = require('../models/orderItem.model');

exports.createOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const [updated] = await OrderItem.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    
    const updatedItem = await OrderItem.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};