import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { checkAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-checkout-session', checkAuth, paymentController.createCheckoutSession);
router.post('/create-single-item-checkout', checkAuth, paymentController.createSingleProductCheckout);

export default router;