const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send order confirmation email
  async sendOrderConfirmation(customerEmail, orderDetails) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fooddelivery.com',
        to: customerEmail,
        subject: 'Order Confirmation - Food Delivery',
        html: this.generateOrderConfirmationHTML(orderDetails)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send order status update email
  async sendOrderStatusUpdate(customerEmail, orderId, newStatus) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fooddelivery.com',
        to: customerEmail,
        subject: `Order Status Update - ${newStatus}`,
        html: this.generateStatusUpdateHTML(orderId, newStatus)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Order status update email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending order status update email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send delivery assignment notification to rider
  async sendDeliveryAssignment(riderEmail, deliveryDetails) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fooddelivery.com',
        to: riderEmail,
        subject: 'New Delivery Assignment',
        html: this.generateDeliveryAssignmentHTML(deliveryDetails)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Delivery assignment email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending delivery assignment email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send restaurant approval notification
  async sendRestaurantApproval(restaurantEmail, restaurantDetails) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fooddelivery.com',
        to: restaurantEmail,
        subject: 'Restaurant Approved - Welcome to Food Delivery!',
        html: this.generateRestaurantApprovalHTML(restaurantDetails)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Restaurant approval email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending restaurant approval email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordReset(email, resetToken) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fooddelivery.com',
        to: email,
        subject: 'Password Reset Request',
        html: this.generatePasswordResetHTML(resetLink)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email to new users
  async sendWelcomeEmail(email, userDetails) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@fooddelivery.com',
        to: email,
        subject: 'Welcome to Food Delivery!',
        html: this.generateWelcomeEmailHTML(userDetails)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // HTML templates
  generateOrderConfirmationHTML(orderDetails) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation</h2>
        <p>Thank you for your order! Here are the details:</p>
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
          <h3>Order #${orderDetails.id}</h3>
          <p><strong>Restaurant:</strong> ${orderDetails.restaurant?.name}</p>
          <p><strong>Total:</strong> $${orderDetails.total_amount}</p>
          <p><strong>Status:</strong> ${orderDetails.status}</p>
        </div>
        <p>You will receive updates on your order status.</p>
      </div>
    `;
  }

  generateStatusUpdateHTML(orderId, newStatus) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Status Update</h2>
        <p>Your order status has been updated:</p>
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
          <h3>Order #${orderId}</h3>
          <p><strong>New Status:</strong> ${newStatus}</p>
        </div>
      </div>
    `;
  }

  generateDeliveryAssignmentHTML(deliveryDetails) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Delivery Assignment</h2>
        <p>You have been assigned a new delivery:</p>
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
          <h3>Order #${deliveryDetails.orderId}</h3>
          <p><strong>Customer:</strong> ${deliveryDetails.customerName}</p>
          <p><strong>Address:</strong> ${deliveryDetails.deliveryAddress}</p>
          <p><strong>Estimated Time:</strong> ${deliveryDetails.estimatedTime}</p>
        </div>
        <p>Please pick up the order as soon as possible.</p>
      </div>
    `;
  }

  generateRestaurantApprovalHTML(restaurantDetails) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Restaurant Approved!</h2>
        <p>Congratulations! Your restaurant has been approved and is now live on our platform.</p>
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
          <h3>${restaurantDetails.name}</h3>
          <p>You can now start receiving orders through our platform.</p>
        </div>
        <p>Welcome to the Food Delivery family!</p>
      </div>
    `;
  }

  generatePasswordResetHTML(resetLink) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }

  generateWelcomeEmailHTML(userDetails) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Food Delivery!</h2>
        <p>Hi ${userDetails.name},</p>
        <p>Thank you for joining Food Delivery! Your account has been created successfully.</p>
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
          <p><strong>Email:</strong> ${userDetails.email}</p>
          <p><strong>Role:</strong> ${userDetails.role}</p>
        </div>
        <p>You can now start using our platform to order food or manage your restaurant.</p>
      </div>
    `;
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return { success: true };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
