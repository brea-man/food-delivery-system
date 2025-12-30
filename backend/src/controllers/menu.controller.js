const MenuItem = require('../models/menuItem.model');
const Restaurant = require('../models/restaurant.model');

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      include: [{ model: Restaurant, as: 'restaurant' }]
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: 'restaurant' }]
    });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item', error: error.message });
  }
};

// Create menu item
const createMenuItem = async (req, res) => {
  try {
    const { restaurant_id, name, description, price, category, image_url } = req.body;
    const menuItem = await MenuItem.create({
      restaurant_id,
      name,
      description,
      price,
      category,
      image_url
    });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image_url, is_available } = req.body;
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    await menuItem.update({
      name,
      description,
      price,
      category,
      image_url,
      is_available
    });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    await menuItem.destroy();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.findAll({
      attributes: ['category'],
      group: ['category'],
      where: {
        category: {
          [require('sequelize').Op.ne]: null
        }
      }
    });
    const categoryList = categories.map(item => item.category);
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
};
