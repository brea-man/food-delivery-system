const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRoles: authorize } = require('../middlewares/role.middleware');

router.get('/', menuController.getAllMenuItems);
router.get('/categories', menuController.getCategories);
router.get('/:id', menuController.getMenuItemById);
router.post('/', authenticate, authorize(['admin', 'restaurant_owner', 'restaurant']), menuController.createMenuItem);
router.put('/:id', authenticate, authorize(['admin', 'restaurant_owner', 'restaurant']), menuController.updateMenuItem);
router.delete('/:id', authenticate, authorize(['admin', 'restaurant_owner', 'restaurant']), menuController.deleteMenuItem);

module.exports = router;