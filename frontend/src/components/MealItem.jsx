import { useContext } from 'react';
import { currencyFormator } from "./Formatting";
import Button from "./UI/Button";
import { CartContext } from './CartContext';

export default function MealItem({ meal }) {
  const cartCtx = useContext(CartContext);

  function handleAddToCart() {
    cartCtx.addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image: meal.image
    });
  }

  return (
    <li className="meal-item">
      <article>
        <img src={`https://food-ordering-app-r7sm.onrender.com/meals/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">{currencyFormator.format(meal.price)}</p>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        <p className="meal-item-action">
          <Button onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </p>
      </article>
    </li>
  );
}
