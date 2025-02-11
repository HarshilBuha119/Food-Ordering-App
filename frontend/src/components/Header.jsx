import { useContext, useState } from 'react';
import logoImg from "../assets/logo.jpg";
import Button from "./UI/Button";
import { CartContext } from './CartContext';
import Cart from './UI/Cart';

export default function Header() {
  const [showCart, setShowCart] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalCartItems = cartCtx.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleShowCart() {
    setShowCart(true);
  }

  function handleHideCart() {
    setShowCart(false);
  }

  return (
    <>
      {showCart && <Cart onClose={handleHideCart} />}
      <header id="main-header">
        <div id="title">
          <img src={logoImg} alt="logo" />
          <h1>Food Order</h1>
        </div>
        <nav>
          <Button textOnly onClick={handleShowCart}>
            Cart ({totalCartItems})
          </Button>
        </nav>
      </header>
    </>
  );
}