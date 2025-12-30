const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles: authorize } = require('../middlewares/role.middleware');

router.get('/', authenticate, authorize(['admin']), orderController.getAllOrders);
router.get('/my-orders', authenticate, orderController.getOrdersByCustomer);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);
router.put('/:id/status', authenticate, authorize(['restaurant_owner', 'admin', 'rider']), orderController.updateOrderStatus);
router.get('/restaurant/:restaurantId', authenticate, authorize(['restaurant_owner', 'admin']), orderController.getOrdersByRestaurant);

module.exports = router;