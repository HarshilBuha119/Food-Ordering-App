import { createContext, useState } from 'react';

export const CartContext = createContext({
  items: [],
  addItem: () => {},
  updateItemQuantity: () => {},
});

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addItem(item) {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // If item exists, increment its quantity
        return prevItems.map((i) => {
          if (i.id === item.id) {
            return { ...i, quantity: i.quantity + 1 };
          }
          return i;
        });
      }
      // If item doesn't exist, add it with quantity 1
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }

  function updateItemQuantity(itemId, amount) {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity + amount };
        }
        return item;
      });
      return updatedItems.filter((item) => item.quantity > 0);
    });
  }

  const cartContext = {
    items: cartItems,
    addItem,
    updateItemQuantity,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {children}
    </CartContext.Provider>
  );
}