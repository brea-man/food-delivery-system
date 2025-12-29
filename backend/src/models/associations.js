const User = require('./user.model');
const Restaurant = require('./restaurant.model');
const MenuItem = require('./menuItem.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Delivery = require('./delivery.model');

// Restaurant <-> Menu
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurant_id', as: 'menuItems' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });

// User <-> Restaurant (Owner)
User.hasMany(Restaurant, { foreignKey: 'owner_id', as: 'ownedRestaurants' });
Restaurant.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Order Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

// Delivery Relationships
Order.hasOne(Delivery, { foreignKey: 'orderId' });
Delivery.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Delivery, { foreignKey: 'deliveryPersonId', as: 'deliveries' });
Delivery.belongsTo(User, { foreignKey: 'deliveryPersonId', as: 'rider' });