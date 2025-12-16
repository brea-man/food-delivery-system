require("dotenv").config({ quiet: true });
     // 1️⃣ load env first
require("./config/db");        // 2️⃣ initialize DB

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
