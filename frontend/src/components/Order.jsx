import { createPortal } from "react-dom";
import { currencyFormator } from "./Formatting";
import { useState, useContext } from "react";
import { CartContext } from "./CartContext";

export default function Order({ onClose, cartItems, onGoBack }) {
  const cartCtx = useContext(CartContext);
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

    const orderData = {
      order: {
        orderNumber: orderNumber,
        date: currentDate,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        customer: customerData,
        subtotal: totalPrice,
        tax: totalPrice * 0.18,
        finalTotal: totalPrice * 1.18,
        status: 'pending'
      }
    };

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit order.');
      }

      setOrderSubmitted(true);
      // Clear cart after successful order
      cartCtx.items.forEach(item => {
        cartCtx.updateItemQuantity(item.id, -item.quantity);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <>
      <div className="backdrop" onClick={orderSubmitted ? onClose : null} />
      <div className="order-modal">
        {!orderSubmitted ? (
          <>
            <h2>Complete Your Order</h2>
            <div className="order-content">
              <div className="order-summary">
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

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="order-form">
                  <h3>Delivery Details</h3>
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

                  <div className="order-actions">
                    <button type="button" className="text-button" onClick={onGoBack}>
                      Back to Cart
                    </button>
                    <button 
                      type="submit" 
                      className="button" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="order-success">
            <h2>Thank You for Your Order!</h2>
            <div className="success-content">
              <p className="order-number">Order #{orderNumber}</p>
              <p className="success-message">
                Your order has been successfully placed. You will receive a confirmation email shortly.
              </p>
              <div className="order-actions">
                <button className="button" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.getElementById("modal")
  );
}