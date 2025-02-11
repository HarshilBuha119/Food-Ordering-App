import { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { CartContext } from '../CartContext';
import { currencyFormator } from '../Formatting';
import Checkout from '../CheckOut';

export default function Cart({ onClose }) {
  const cartCtx = useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalPrice = cartCtx.items.reduce(
    (total, item) => total + item.quantity * parseFloat(item.price),
    0
  );

  function handleCheckout() {
    setShowCheckout(true);
  }

  function handleCloseCheckout() {
    setShowCheckout(false);
    onClose();
    cartCtx.items.forEach(item => {
      cartCtx.updateItemQuantity(item.id, -item.quantity);
    });
  }

  function handleGoBack() {
    setShowCheckout(false);
  }

  if (showCheckout) {
    return <Checkout 
      onClose={handleCloseCheckout} 
      cartItems={cartCtx.items}
      onGoBack={handleGoBack}
    />;
  }

  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="cart-modal">
        <h2>Your Cart</h2>
        <ul className='cart-items'>
          {cartCtx.items.map((item) => (
            <li key={item.id} className="cart-item">
              <div>
                <span>{item.name}</span>
                <span> ({currencyFormator.format(item.price)})</span>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => cartCtx.updateItemQuantity(item.id, -1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => cartCtx.updateItemQuantity(item.id, 1)}>
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="cart-total">{currencyFormator.format(totalPrice)}</p>
        <p className="modal-actions">
          <button className="text-button" onClick={onClose}>
            Close
          </button>
          {cartCtx.items.length > 0 ?
            <button className="button" onClick={handleCheckout}>
              Checkout
            </button> : <h2>Your cart is empty</h2>
          }
        </p>
      </div>
    </>,
    document.getElementById('modal')
  );
}
