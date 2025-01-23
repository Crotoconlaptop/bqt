import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import cocktails from "../data/cocktails";

const DrinksCalculator = () => {
  const [guests, setGuests] = useState(0);
  const [selectedCocktails, setSelectedCocktails] = useState([]);
  const [output, setOutput] = useState("");

  const handleCalculate = () => {
    // Basic validation
    if (isNaN(guests) || guests <= 0) {
      setOutput("Please enter a valid number of guests.");
      return;
    }

    // Check if cocktails exist
    const unavailable = selectedCocktails.filter(
      (c) => !cocktails[c.toLowerCase()]
    );
    if (unavailable.length > 0) {
      setOutput(
        `The following cocktails are not available: ${unavailable.join(", ")}`
      );
      return;
    }

    // General drinks
    const generalDrinks = {
      Pepsi: (0.2 * guests).toFixed(2),
      "7Up": (0.2 * guests).toFixed(2),
      "Sparkling Water": (0.5 * guests).toFixed(2),
      "Still Water": (0.5 * guests).toFixed(2),
    };

    // Ingredients for each selected cocktail
    const ingredients = {};
    selectedCocktails.forEach((cocktailName) => {
      const cocktail = cocktails[cocktailName.toLowerCase()];
      cocktail.ingredients.forEach((ingredient) => {
        if (!ingredients[ingredient]) {
          ingredients[ingredient] = 0;
        }
        ingredients[ingredient] += guests; // Example logic, 1 unit per guest
      });
    });

    // Create output string
    let result = "General Drinks (liters):\n";
    for (const [drink, amount] of Object.entries(generalDrinks)) {
      result += `- ${drink}: ${amount} liters\n`;
    }

    result += "\nCocktail Ingredients (units):\n";
    for (const [ingredient, amount] of Object.entries(ingredients)) {
      result += `- ${ingredient}: ${amount} units\n`;
    }

    setOutput(result);
  };

  const handleSelectAll = () => {
    setSelectedCocktails(Object.keys(cocktails));
  };

  const handleDownloadExcel = () => {
    if (!output) {
      alert("Please calculate the drinks before downloading the Excel file.");
      return;
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: General Drinks
    const generalDrinksData = [
      ["Drink", "Calculated (liters)", "Real Usage (liters)"],
      ["Pepsi", (0.2 * guests).toFixed(2), ""],
      ["7Up", (0.2 * guests).toFixed(2), ""],
      ["Sparkling Water", (0.5 * guests).toFixed(2), ""],
      ["Still Water", (0.5 * guests).toFixed(2), ""],
    ];
    const generalDrinksSheet = XLSX.utils.aoa_to_sheet(generalDrinksData);
    XLSX.utils.book_append_sheet(workbook, generalDrinksSheet, "General Drinks");

    // Sheet 2: Cocktail Ingredients
    const ingredientsArr = [
      ["Ingredient", "Calculated (units)", "Real Usage (units)"],
    ];

    // Summarize ingredients
    const ingredients = {};
    selectedCocktails.forEach((cocktailName) => {
      const cocktail = cocktails[cocktailName.toLowerCase()];
      cocktail.ingredients.forEach((ingredient) => {
        if (!ingredients[ingredient]) {
          ingredients[ingredient] = 0;
        }
        ingredients[ingredient] += guests;
      });
    });

    Object.entries(ingredients).forEach(([ingredient, amount]) => {
      ingredientsArr.push([ingredient, amount, ""]);
    });

    const ingredientsSheet = XLSX.utils.aoa_to_sheet(ingredientsArr);
    XLSX.utils.book_append_sheet(
      workbook,
      ingredientsSheet,
      "Cocktail Ingredients"
    );

    // Write and download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "drink_calculations.xlsx");
  };

  return (
    <div className="box">
      <h2>Drinks Calculator</h2>
      <div>
        <label>Number of Guests:</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>

      <div>
        <label>Select Cocktails:</label>
        <div className="checklist">
          {Object.keys(cocktails).map((name) => (
            <label key={name}>
              <input
                type="checkbox"
                value={name}
                checked={selectedCocktails.includes(name)}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCocktails((prev) =>
                    prev.includes(val)
                      ? prev.filter((c) => c !== val)
                      : [...prev, val]
                  );
                }}
              />
              {name.replace("_", " ").toUpperCase()}
            </label>
          ))}
        </div>
        <button className="btn" onClick={handleSelectAll}>
          Select All
        </button>
      </div>

      <button className="btn" onClick={handleCalculate}>
        Calculate
      </button>

      <pre style={{ background: "#eee", padding: "1rem", marginTop: "1rem" }}>
        {output}
      </pre>

      <button className="btn" onClick={handleDownloadExcel}>
        Download Excel
      </button>
    </div>
  );
};

export default DrinksCalculator;
