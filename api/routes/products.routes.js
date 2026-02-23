import express from "express";
import * as productsController from "../controllers/products.controller.js";

const router = express.Router();

router.get("/:type", productsController.getAllProducts);
router.get("/:type/:id", productsController.getProductById);

export default router;
