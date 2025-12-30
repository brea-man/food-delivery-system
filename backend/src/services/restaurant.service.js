const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');

class RestaurantService {
  // Create new restaurant
  async createRestaurant(ownerId, restaurantData) {
    try {
      const restaurant = await Restaurant.create({
        ...restaurantData,
        owner_id: ownerId,
        status: 'pending'
      });
      return restaurant;
    } catch (error) {
      throw new Error(`Error creating restaurant: ${error.message}`);
    }
  }

  // Get restaurant by ID with owner
  async getRestaurantById(id) {
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: [{ model: User, as: 'owner', attributes: ['name', 'email'] }]
      });
      return restaurant;
    } catch (error) {
      throw new Error(`Error fetching restaurant: ${error.message}`);
    }
  }

  // Get all restaurants
  async getAllRestaurants(filters = {}) {
    try {
      const whereClause = {};
      if (filters.status) whereClause.status = filters.status;
      if (filters.owner_id) whereClause.owner_id = filters.owner_id;

      const restaurants = await Restaurant.findAll({
        where: whereClause,
        include: [{ model: User, as: 'owner', attributes: ['name', 'email'] }],
        order: [['createdAt', 'DESC']]
      });
      return restaurants;
    } catch (error) {
      throw new Error(`Error fetching restaurants: ${error.message}`);
    }
  }

  // Update restaurant
  async updateRestaurant(id, updateData) {
    try {
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      await restaurant.update(updateData);
      return restaurant;
    } catch (error) {
      throw new Error(`Error updating restaurant: ${error.message}`);
    }
  }

  // Delete restaurant
  async deleteRestaurant(id) {
    try {
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      await restaurant.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting restaurant: ${error.message}`);
    }
  }

  // Approve restaurant
  async approveRestaurant(id) {
    try {
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      await restaurant.update({ status: 'active' });
      return restaurant;
    } catch (error) {
      throw new Error(`Error approving restaurant: ${error.message}`);
    }
  }

  // Get restaurant menu
  async getRestaurantMenu(restaurantId) {
    try {
      const { MenuItem } = require('../models');
      const menuItems = await MenuItem.findAll({
        where: { restaurant_id: restaurantId, is_available: true },
        order: [['category', 'ASC'], ['name', 'ASC']]
      });
      return menuItems;
    } catch (error) {
      throw new Error(`Error fetching restaurant menu: ${error.message}`);
    }
  }
}

module.exports = new RestaurantService();
