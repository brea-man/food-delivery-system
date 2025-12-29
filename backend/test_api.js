const BASE_URL = 'http://localhost:5000/api';

// Helper to print results
const log = (step, msg, success) => {
  console.log(`${step} ${msg}: ${success ? '✅ Success' : '❌ Failed'}`);
};

async function testBackend() {
  console.log("🚀 Starting Backend Tests...\n");
  let customerToken = '';
  let adminToken = '';
  let userId = '';
  let restaurantId = '';
  let menuItemId = '';
  let orderId = '';

  try {
    // 1. Register Customer
    const email = `testuser${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: "password123", role: "customer", name: "Tester" })
    });
    const regData = await regRes.json();
    log('1️⃣', 'Register Customer', regRes.ok);

    // 2. Login Customer
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: "password123" })
    });
    const loginData = await loginRes.json();
    customerToken = loginData.accessToken;
    userId = loginData.user?.id;
    log('2️⃣', 'Login Customer', !!customerToken);

    // 3. Register & Login Admin (For Restaurant Creation)
    const adminEmail = `admin${Date.now()}@example.com`;
    await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: "password123", role: "admin", name: "Admin User" })
    });
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: "password123" })
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.accessToken;
    log('3️⃣', 'Register/Login Admin', !!adminToken);

    if (!customerToken || !adminToken) throw new Error("Auth failed, stopping tests.");

    // 4. Create Restaurant (Using Admin Token)
    const restRes = await fetch(`${BASE_URL}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: "Test Bistro", address: "123 Food St", status: "open" })
    });
    const restData = await restRes.json();
    if (restRes.ok) restaurantId = restData.data?.id || 1; 
    log('4️⃣', 'Create Restaurant (Admin)', restRes.ok);

    // 5. Create Menu Item (Using Admin/Owner Token)
    if (restaurantId) {
      const menuRes = await fetch(`${BASE_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ restaurant_id: restaurantId, name: "Cheese Burger", price: 12.50, category: "Main" })
      });
      const menuData = await menuRes.json();
      if (menuRes.ok) menuItemId = menuData.id;
      log('5️⃣', 'Create Menu Item', menuRes.ok);
    }

    // 6. Create Order (Using Customer Token)
    if (restaurantId && menuItemId) {
      const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          deliveryAddress: "123 Customer Lane",
          items: [{ menuItemId, quantity: 2 }]
        })
      });
      const orderData = await orderRes.json();
      if (orderRes.ok) orderId = orderData.id;
      log('6️⃣', 'Place Order (Customer)', orderRes.ok);
    }

    // 7. Test Order Items (Direct CRUD)
    if (orderId && menuItemId) {
      const oiRes = await fetch(`${BASE_URL}/order-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          menuItemId,
          quantity: 1,
          price: 5.00
        })
      });
      log('7️⃣', 'Direct Create OrderItem', oiRes.ok);
      
      const oiGet = await fetch(`${BASE_URL}/order-items`);
      log('8️⃣', 'Get All OrderItems', oiGet.ok);
    }

    console.log("\n✅ Testing Sequence Completed.");

  } catch (err) {
    console.error("\n❌ Test Error:", err.message);
  }
}

testBackend();