import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { checkAuth } from '../middleware/auth.middleware.js'; 

const router = express.Router();
router.use(checkAuth);

router.post('/add', cartController.addToCart);
router.patch('/update/:itemId', cartController.updateCartItem);
router.delete('/remove/:itemId', cartController.removeCartItem);
router.get('/', cartController.getCart);

export default router;
