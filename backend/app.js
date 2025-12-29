require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models/schemas');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/menu', require('./routes/menu.routes'));
app.use('/api/deliveries', require('./routes/delivery.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Start Server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Connected to PostgreSQL and synced models');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Could not connect to PostgreSQL:', err));