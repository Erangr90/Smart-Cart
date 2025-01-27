import fs from "fs";
import Snacks from "../jsons/Snacks.json" assert { type: "json" };
import Clean from "../jsons/Clean.json" assert { type: "json" };
import Meat from "../jsons/Meat.json" assert { type: "json" };
import Dairy from "../jsons/Dairy.json" assert { type: "json" };

const snacksArray = Snacks;
const cleanArray = Clean;
const meatArray = Meat;
const dairyArray = Dairy;

const products = [];

snacksArray.forEach((obj) => {
  products.push({
    name: obj.product_name,
    image: obj.product_image,
    manufacturer: obj.manufacturer_name,
    category: 1,
    description: obj.product_description,
    barcode: Number(obj.product_barcode),
    unitOfMeasure: obj.product_unit_name,
    measure: Number(obj.product_quantity),
    country: obj.country_name,
    country_code: obj.country_code,
  });
});
cleanArray.forEach((obj) => {
  products.push({
    name: obj.product_name,
    image: obj.product_image,
    manufacturer: obj.manufacturer_name,
    category: 2,
    description: obj.product_description,
    barcode: Number(obj.product_barcode),
    unitOfMeasure: obj.product_unit_name,
    measure: Number(obj.product_quantity),
    country: obj.country_name,
    country_code: obj.country_code,
  });
});
meatArray.forEach((obj) => {
  products.push({
    name: obj.product_name,
    image: obj.product_image,
    manufacturer: obj.manufacturer_name,
    category: 3,
    description: obj.product_description,
    barcode: Number(obj.product_barcode),
    unitOfMeasure: obj.product_unit_name,
    measure: Number(obj.product_quantity),
    country: obj.country_name,
    country_code: obj.country_code,
  });
});
dairyArray.forEach((obj) => {
  products.push({
    name: obj.product_name,
    image: obj.product_image,
    manufacturer: obj.manufacturer_name,
    category: 4,
    description: obj.product_description,
    barcode: Number(obj.product_barcode),
    unitOfMeasure: obj.product_unit_name,
    measure: Number(obj.product_quantity),
    country: obj.country_name,
    country_code: obj.country_code,
  });
});

const jsonData = JSON.stringify(products, null, 2);

fs.writeFile("products.json", jsonData, "utf8", (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
  } else {
    console.log("JSON file has been saved.");
  }
});
