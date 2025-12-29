const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItem.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles: authorize } = require('../middlewares/role.middleware');

router.post('/', authenticate, orderItemController.createOrderItem);
router.get('/', authenticate, authorize(['admin']), orderItemController.getOrderItems);
router.get('/:id', authenticate, orderItemController.getOrderItem);
router.put('/:id', authenticate, authorize(['admin']), orderItemController.updateOrderItem);
router.delete('/:id', authenticate, authorize(['admin']), orderItemController.deleteOrderItem);

module.exports = router;