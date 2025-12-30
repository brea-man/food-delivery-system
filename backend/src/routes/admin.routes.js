const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles: authorize } = require('../middlewares/role.middleware');

router.use(authenticate, authorize(['admin']));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/restaurants', adminController.getRestaurants);
router.put('/restaurants/:id/status', adminController.updateRestaurantStatus);
router.get('/orders', adminController.getOrders);
router.get('/deliveries/stats', adminController.getDeliveryStats);

module.exports = router;