import express from 'express';
import * as eventsController from '../controllers/events.controller.js';

const router = express.Router();

router.get('/upcoming', eventsController.getUpcomingEvents);
router.get('/past', eventsController.getPastEvents);
router.get('/gallery', eventsController.getGallery);

export default router;