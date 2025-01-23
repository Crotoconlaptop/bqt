import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Example of an inventory item:
 * {
 *   name: "Pepsi",
 *   quantity: 50,
 *   unit: "liters"
 * }
 */

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("units");

  // Agrega un nuevo producto de forma manual
  const handleAddProduct = () => {
    if (!name.trim()) return;
    const newItem = {
      name,
      quantity: parseFloat(quantity) || 0,
      unit,
    };
    setInventory((prev) => [...prev, newItem]);
    setName("");
    setQuantity(0);
    setUnit("units");
  };

  // Descarga el inventario como un archivo Excel
  const handleDownloadInventory = () => {
    if (inventory.length === 0) {
      alert("No inventory items to download.");
      return;
    }
    const workbook = XLSX.utils.book_new();

    // Crea la hoja con Name, Quantity, Unit
    const data = [
      ["Name", "Quantity", "Unit"], // encabezados
    ];

    inventory.forEach((item) => {
      data.push([item.name, item.quantity, item.unit]);
    });

    const sheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "Inventory");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "inventory.xlsx");
  };

  // Carga el inventario desde un archivo Excel
  const handleUploadInventory = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Formato esperado:
      // [["Name","Quantity","Unit"], ["Pepsi",20,"liters"], ...]
      const newInventory = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.length < 3) continue; // salta filas incompletas
        newInventory.push({
          name: row[0],
          quantity: parseFloat(row[1]) || 0,
          unit: row[2],
        });
      }
      setInventory(newInventory);
      e.target.value = null; // Limpia el input file
    };
    reader.readAsArrayBuffer(file);
  };

  // Función para manejar cambios en la tabla editable
  const handleInventoryChange = (index, key, value) => {
    const updated = [...inventory];
    // 'key' será "name", "quantity" o "unit"
    if (key === "quantity") {
      updated[index][key] = parseFloat(value) || 0;
    } else {
      updated[index][key] = value;
    }
    setInventory(updated);
  };

  // Elimina un producto de la tabla
  const handleDelete = (index) => {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="box">
      <h2>Inventory Manager</h2>

      <div>
        <label>Product Name:</label>
        <input
          type="text"
          placeholder="e.g. Pepsi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Quantity:</label>
        <input
          type="number"
          placeholder="e.g. 10"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <label>Unit:</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="units">units</option>
          <option value="liters">liters</option>
          <option value="kg">kg</option>
          <option value="grams">grams</option>
          {/* Agrega más según tus necesidades */}
        </select>

        <button className="btn" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input type="file" onChange={handleUploadInventory} />
        <button className="btn" onClick={handleDownloadInventory}>
          Download Inventory
        </button>
      </div>

      <h3>Current Inventory</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#ddd" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Unit</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              {/* Campo editable para Name */}
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleInventoryChange(index, "name", e.target.value)}
                />
              </td>

              {/* Campo editable para Quantity */}
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInventoryChange(index, "quantity", e.target.value)}
                  style={{ width: "80px" }}
                />
              </td>

              {/* Campo editable para Unit */}
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <select
                  value={item.unit}
                  onChange={(e) => handleInventoryChange(index, "unit", e.target.value)}
                >
                  <option value="units">units</option>
                  <option value="liters">liters</option>
                  <option value="kg">kg</option>
                  <option value="grams">grams</option>
                  {/* Más opciones si se desea */}
                </select>
              </td>

              {/* Botón para eliminar la fila */}
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button
                  className="btn"
                  style={{ backgroundColor: "#e76f51" }}
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;
