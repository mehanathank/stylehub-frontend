const Express = require("express");
const router = Express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../Controllers/ProductController");

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
