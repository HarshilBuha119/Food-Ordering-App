import { useEffect, useState } from "react";
import MealItem from "./MealItem";

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);
  const mealss=loadedMeals

  useEffect(() => {
    async function fetchMeals() {
      const response = await fetch("https://food-ordering-app-r7sm.onrender.com/meals");
      const meals = await response.json();
      setLoadedMeals(meals);
    }
    fetchMeals();
  }, []);
  
  return (
    <ul id="meals">
      {mealss.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
