require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express(); //creates middleware pipeline, routing system, HTTP interface
//Global Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const orderItemRoutes = require('./routes/orderItem.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes); // ✅ Fixed to match API spec
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.send("Food Delivery API is running ✅");
});

module.exports = app;
