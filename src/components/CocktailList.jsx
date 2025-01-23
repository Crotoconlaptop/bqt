import React from "react";
import cocktails from "../data/cocktails";

const CocktailList = () => {
  return (
    <div className="box">
      <h2>Available Cocktails</h2>
      <ul>
        {Object.entries(cocktails).map(([name, details]) => (
          <li key={name} style={{ marginBottom: "1rem", borderBottom: "1px solid #eee" }}>
            <h3 style={{ color: "#2a9d8f" }}>
              {name.replace("_", " ").toUpperCase()}
            </h3>
            <p>
              <strong>Ingredients:</strong> {details.ingredients.join(", ")}
            </p>
            <p style={{ fontStyle: "italic" }}>{details.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CocktailList;
