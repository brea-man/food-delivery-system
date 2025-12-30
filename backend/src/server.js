 // 1️⃣ load env first
require("dotenv").config({ quiet: true });
    
const sequelize = require("./config/db");        // 2️⃣ initialize DB

// 3️⃣ Load Models so they are synced
require('./models/order.model');
require('./models/orderItem.model');
require('./models/delivery.model');

// 4️⃣ Load Associations (Relationships)
require('./models/associations');

const app = require("./app");

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Tables created/updated");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => console.error("❌ DB Sync Error:", err));
