import express from 'express';
import Trip from '../controller/trip.controller';
import Authentication from '../middleware/Auth';

const router = express.Router();

router.post('/trips', Authentication.verify_token, Trip.create_trip);
router.get('/trips', Authentication.verify_token, Trip.getAllTrips);
router.patch('/trips/:id', Authentication.verify_token, Trip.cancelATrip);

export default router;
