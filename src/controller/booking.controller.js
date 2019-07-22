/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import moment from 'moment';
import db from '../model/db';
import {
  book_trip_query,
  get_trip_query,
  find_user_query,
  check_booked_query,
  get_all_admin_booking_query,
  get_all_user_booking_query,
  delete_booking,
} from '../model/booking.model';


const Bookings = {
  /**
   * Users can book a seat for a trip
   * @param {*} req
   * @param {*} res
  */
  async book_trip(req, res) {
    const { trip_id, seat_number } = req.body;
    try {
      const { rows } = await db.query(get_trip_query, [trip_id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Trip not found!',
        });
      }

      if (rows[0].status === 'canceled') {
        return res.status(400).json({
          status: 'error',
          error: 'This trip has been canceled, you can not book it',
        });
      }
      const get_user = await db.query(find_user_query, [req.user]);
      const user = get_user.rows[0];
      // check if user has booked a seat on the trip
      const new_booking = await db.query(check_booked_query,
        [rows[0].trip_id, user.user_id]);
      if (new_booking.rows[0]) {
        return res.status(400).json({
          status: 'error',
          error: 'You already booked a seat for the trip',
        });
      }

      const values = [
        req.user,
        trip_id,
        moment(new Date()),
        rows[0].bus_id,
        rows[0].trip_date,
        seat_number,
        user.first_name,
        user.last_name,
        user.email,
      ];

      const booking = await db.query(book_trip_query, values);
      return res.status(201).json({
        status: 'success',
        data: booking.rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: 'Something went wrong, try again',
      });
    }
  },
  /**
   * Admin can see all bookings
   * @param {*} req
   * @param {*} res
  */
  async get_all_admin_booking(req, res) {
    if (!req.admin) {
      res.status(400).json({
        status: 'error',
        error: 'Unauthorized',
      });
    }
    try {
      if (req.admin) {
        const { rows } = await db.query(get_all_admin_booking_query);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            error: 'Bookings not found',
          });
        }
        return res.status(200).json({
          status: 'success',
          data: rows,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Something went wrong, try again',
      });
    }
  },

  async get_user_booking(req, res) {
    try {
      const { rows } = await db.query(get_all_user_booking_query, [req.user]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Booking not found',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Something went wrong, try again',
      });
    }
  },
  /**
 * User can delete their bookings
 * @param {*} req
 * @param {*} res
 */
  async deleteBooking(req, res) {
    try {
      const { rows } = await db.query(delete_booking, [req.params.booking_id, req.user]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 'error',
          error: 'Not Found',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Booking successfully deleted',
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: 'Something went wrong, try again',
      });
    }
  },
};

export default Bookings;
