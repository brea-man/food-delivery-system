const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles: authorize } = require('../middlewares/role.middleware');
const sequelize = require('../config/db');

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { Delivery, Order } = sequelize.models;
    const deliveries = await Delivery.findAll({
      include: [
        { model: Order, as: 'Order' }
      ]
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error: error.message });
  }
});
router.get('/available', authenticate, authorize(['rider']), deliveryController.getAvailableDeliveries);
router.get('/my-deliveries', authenticate, authorize(['rider']), deliveryController.getDeliveriesByRider);
router.get('/:id', authenticate, deliveryController.getDeliveryById);
router.put('/:id/assign', authenticate, authorize(['admin']), deliveryController.assignDelivery);
router.put('/:id/status', authenticate, authorize(['rider', 'admin']), deliveryController.updateDeliveryStatus);

module.exports = router;