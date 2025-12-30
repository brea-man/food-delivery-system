const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles: authorize } = require('../middlewares/role.middleware');

router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', authenticate, authorize(['admin']), restaurantController.createRestaurant);
router.put('/:id', authenticate, authorize(['admin', 'restaurant_owner']), restaurantController.updateRestaurant);
router.delete('/:id', authenticate, authorize(['admin']), restaurantController.deleteRestaurant);

router.get('/:restaurantId/menu', restaurantController.getRestaurantMenu);
router.post('/:restaurantId/menu', authenticate, authorize(['restaurant_owner', 'restaurant']), restaurantController.addMenuItem);
router.put('/:restaurantId/menu/:itemId', authenticate, authorize(['restaurant_owner', 'restaurant']), restaurantController.updateMenuItem);
router.delete('/:restaurantId/menu/:itemId', authenticate, authorize(['restaurant_owner', 'restaurant']), restaurantController.deleteMenuItem);

module.exports = router;