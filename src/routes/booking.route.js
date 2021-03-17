import express from 'express';
import Bookings from '../controller/booking.controller';
import Authentication from '../middleware/Auth';

const router = express.Router();

router.post('/bookings', Authentication.verify_token, Bookings.book_trip);
router.get('/bookings', Authentication.verify_token, Bookings.get_all_admin_booking);
router.get('/bookings/:booking_id', Authentication.verify_token, Bookings.get_user_booking);
router.delete('/bookings/:booking_id', Authentication.verify_token, Bookings.deleteBooking);

export default router;
