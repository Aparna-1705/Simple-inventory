const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const PRODUCTS_FILE = "./products.json";

function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE);
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

app.get("/getProducts", (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post("/addProduct", (req, res) => {
  const newProduct = req.body;

  let products = readProducts();
  products.push(newProduct);

  writeProducts(products);

  res.json({ message: "Product added successfully", products });
});

app.delete("/deleteProduct/:productId", (req, res) => {
  const id = parseInt(req.params.productId);

  let products = readProducts();

  const filtered = products.filter((p) => p.productId !== id);

  writeProducts(filtered);

  res.json({ message: `Product with id ${id} deleted`, products: filtered });
});

app.put("/updateProduct/:productId", (req, res) => {
  const id = parseInt(req.params.productId);

  let products = readProducts();

  const index = products.findIndex((p) => p.productId === id);

  if (index !== -1) {
    products[index].description =
      "Preferred by Both Vegetarians and Non Vegetarians";

    writeProducts(products);

    res.json({
      message: `Product ${id} updated successfully`,
      product: products[index],
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});


app.listen(3000, () => {
  console.log("Inventory API Server running on port 3000");
});
