import React from "react";
import CocktailList from "../components/CocktailList";
import DrinksCalculator from "../components/DrinksCalculator";
import InventoryManager from "../components/InventoryManager";

const Home = () => {
  return (
    <div className="container">
      <h1>Event Drinks Calculator</h1>
      <CocktailList />
      <DrinksCalculator />
      <InventoryManager />
    </div>
  );
};

export default Home;
