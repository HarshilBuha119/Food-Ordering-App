<<<<<<< HEAD
import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const app = express();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Initialize data directory and files
async function initializeFiles() {
  try {
    await fs.access('./data');
  } catch {
    await fs.mkdir('./data');
  }

  try {
    await fs.access('./data/orders.json');
    const ordersData = await fs.readFile('./data/orders.json', 'utf8');
    if (!ordersData) {
      await fs.writeFile('./data/orders.json', '[]');
    }
  } catch {
    await fs.writeFile('./data/orders.json', '[]');
  }
}

// Email sending function
async function sendOrderConfirmation(orderData) {
  console.log('Preparing to send email to:', orderData.customer.email);

  const itemsList = orderData.items
    .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">x ${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `)
=======
import nodemailer from 'nodemailer';

// Create transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-app-specific-password' // Your Gmail app-specific password
  }
});

export async function sendOrderConfirmation(orderData) {
  // Create HTML content for email
  const itemsList = orderData.items
    .map(
      item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">x ${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
    )
>>>>>>> dd5a6ee856ad535c4433d1bbe6f9af854ca855a7
    .join('');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ffc404; text-align: center;">Order Confirmation</h2>
      <p>Dear ${orderData.customer.name},</p>
      <p>Thank you for your order! Here are your order details:</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(orderData.date).toLocaleDateString()}</p>
      </div>

      <h3 style="color: #333;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: left;">Quantity</th>
            <th style="padding: 8px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> $${orderData.payment.subtotal}</p>
        <p><strong>Tax (18%):</strong> $${orderData.payment.tax}</p>
        <p style="font-size: 1.2em; color: #ffc404;"><strong>Total:</strong> $${orderData.payment.total}</p>
      </div>

      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333;">Delivery Details</h3>
        <p><strong>Address:</strong><br>
        ${orderData.customer.street}<br>
        ${orderData.customer.city}, ${orderData.customer.postalCode}</p>
      </div>

      <p style="color: #666; font-size: 0.9em;">If you have any questions about your order, please contact us.</p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #888; font-size: 0.8em;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;

  const mailOptions = {
<<<<<<< HEAD
    from: `"Food Order" <${process.env.EMAIL_USER}>`,
=======
    from: '"Food Order" <your-email@gmail.com>',
>>>>>>> dd5a6ee856ad535c4433d1bbe6f9af854ca855a7
    to: orderData.customer.email,
    subject: `Order Confirmation #${orderData.orderNumber}`,
    html: emailHtml
  };

  try {
<<<<<<< HEAD
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

// Initialize files before starting the server
await initializeFiles();

// Routes
app.get('/meals', async (req, res) => {
  try {
    const meals = await fs.readFile('./data/available-meals.json', 'utf8');
    res.json(JSON.parse(meals));
  } catch (error) {
    console.error('Error loading meals:', error);
    res.status(500).json({ message: 'Failed to load meals.' });
  }
});

app.post('/orders', async (req, res) => {
  console.log('Received order:', req.body);
  const orderData = req.body.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Missing order data.' });
  }

  if (
    !orderData.customer.email ||
    !orderData.customer.email.includes('@') ||
    !orderData.customer.name ||
    orderData.customer.name.trim() === '' ||
    !orderData.customer.street ||
    orderData.customer.street.trim() === '' ||
    !orderData.customer['postal-code'] ||
    orderData.customer['postal-code'].trim() === '' ||
    !orderData.customer.city ||
    orderData.customer.city.trim() === ''
  ) {
    return res.status(400).json({
      message: 'Missing customer data: Email, name, street, postal code or city is missing.',
    });
  }

  try {
    // Read existing orders
    let allOrders = [];
    try {
      const ordersData = await fs.readFile('./data/orders.json', 'utf8');
      allOrders = ordersData ? JSON.parse(ordersData) : [];
    } catch {
      allOrders = [];
    }

    // Calculate totals
    const subtotal = orderData.items.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity),
      0
    );
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    // Format the new order
    const newOrder = {
      id: `ORD${Math.random().toString().slice(2, 8)}`,
      orderNumber: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
      date: new Date().toISOString(),
      status: 'pending',
      customer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        street: orderData.customer.street,
        postalCode: orderData.customer['postal-code'],
        city: orderData.customer.city
      },
      items: orderData.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        totalPrice: item.quantity * parseFloat(item.price)
      })),
      payment: {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      },
      createdAt: new Date().toISOString()
    };

    // Add order to array
    allOrders.push(newOrder);

    // Save to file
    await fs.writeFile(
      './data/orders.json', 
      JSON.stringify(allOrders, null, 2)
    );

    // Send confirmation email
    try {
      await sendOrderConfirmation(newOrder);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue as order was still created successfully
    }

    res.status(201).json({ 
      message: 'Order created successfully!',
      orderId: newOrder.id 
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Failed to create order.' });
  }
});

// 404 handler
app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  res.status(404).json({ message: 'Not found' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
=======
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
>>>>>>> dd5a6ee856ad535c4433d1bbe6f9af854ca855a7
