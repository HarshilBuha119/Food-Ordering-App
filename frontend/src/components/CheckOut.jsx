// components/Checkout.jsx
import { createPortal } from "react-dom";
import { currencyFormator } from "./Formatting";
import { useState } from "react";

export default function Checkout({ onClose, cartItems, onGoBack }) {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    street: '',
    'postal-code': '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * parseFloat(item.price),
    0
  );

  const currentDate = new Date().toLocaleDateString();
  const orderNumber = Math.floor(Math.random() * 1000000);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setCustomerData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order: {
            items: cartItems,
            customer: customerData
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit order.');
      }

      setOrderSubmitted(true); // Set to true on successful submission
    } catch (err) {
      setError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (orderSubmitted) {
    return createPortal(
      <>
        <div className="backdrop" onClick={onClose} />
        <div className="checkout-modal">
          <div className="order-success">
            <h2>Thank You for Your Order!</h2>
            <div className="success-content">
              <p className="order-number">Order #{orderNumber}</p>
              <p className="order-date">Date: {currentDate}</p>
              <div className="bill-container">
                <h3>Order Summary</h3>
                <div className="bill-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bill-item">
                      <div className="bill-item-details">
                        <span>{item.name}</span>
                        <span>x {item.quantity}</span>
                      </div>
                      <div className="bill-item-price">
                        {currencyFormator.format(item.quantity * item.price)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bill-total">
                  <div className="subtotal">
                    <span>Subtotal:</span>
                    <span>{currencyFormator.format(totalPrice)}</span>
                  </div>
                  <div className="tax">
                    <span>Tax (18%):</span>
                    <span>{currencyFormator.format(totalPrice * 0.18)}</span>
                  </div>
                  <div className="final-total">
                    <span>Total:</span>
                    <span>{currencyFormator.format(totalPrice * 1.18)}</span>
                  </div>
                </div>
              </div>
              <p className="success-message">
                Your order has been successfully placed. You will receive a confirmation email shortly.
              </p>
              <div className="checkout-actions">
                <button className="button" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.getElementById("modal")
    );
  }

  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="checkout-modal">
        <h2>Checkout</h2>
        <div className="order-details">
          {/* ... rest of your checkout form ... */}
          <div className="bill-container">
            <h3>Order Summary</h3>
            <div className="bill-items">
              {cartItems.map((item) => (
                <div key={item.id} className="bill-item">
                  <div className="bill-item-details">
                    <span>{item.name}</span>
                    <span>x {item.quantity}</span>
                  </div>
                  <div className="bill-item-price">
                    {currencyFormator.format(item.quantity * item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bill-total">
              <div className="subtotal">
                <span>Subtotal:</span>
                <span>{currencyFormator.format(totalPrice)}</span>
              </div>
              <div className="tax">
                <span>Tax (18%):</span>
                <span>{currencyFormator.format(totalPrice * 0.18)}</span>
              </div>
              <div className="final-total">
                <span>Total:</span>
                <span>{currencyFormator.format(totalPrice * 1.18)}</span>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="control">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                required
                value={customerData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="control">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                required
                value={customerData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="control">
              <label htmlFor="street">Street</label>
              <input 
                type="text" 
                id="street" 
                name="street"
                required
                value={customerData.street}
                onChange={handleInputChange}
              />
            </div>

            <div className="control-row">
              <div className="control">
                <label htmlFor="postal-code">Postal Code</label>
                <input 
                  type="text" 
                  id="postal-code" 
                  name="postal-code"
                  required
                  value={customerData['postal-code']}
                  onChange={handleInputChange}
                />
              </div>

              <div className="control">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  required
                  value={customerData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" className="text-button" onClick={onGoBack}>
                Back
              </button>
              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}