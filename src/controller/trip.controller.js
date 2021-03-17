/* eslint-disable camelcase */
import moment from 'moment';
import db from '../model/db';
import {
  create_trip_query,
  bus_availability,
  get_all_trip_query,
  cancel_a_trip_query,
} from '../model/trip.model';


const Trip = {
  /**
  * Admin can create trip
  * @param {object} req
  * @param {object} res
  * @returns {object} bus object
  */
  async create_trip(req, res) {
    // eslint-disable-next-line no-console
    if (!req.admin) {
      return res.status(403).json({
        status: 'error',
        error: 'Unauthorized!',
      });
    }
    // eslint-disable-next-line object-curly-newline
    const { bus_id, origin, destination, trip_date, fare } = req.body;
    // eslint-disable-next-line prefer-const
    let { status } = req.body;

    if (status === null || status === 'undefined') {
      const newStatus = 'active';
      return newStatus;
    }

    const values = [
      bus_id,
      new Date(),
      origin,
      destination,
      trip_date,
      fare,
      'active',
      new Date(),
    ];

    try {
      // check if bus is available
      // eslint-disable-next-line max-len
      const bus = await db.query(bus_availability, [trip_date, bus_id, 'active']);
      if (bus.rows[0]) {
        return res.status(409).json({
          status: 'error',
          error: 'The bus has been schedule for another trip on the same date',
        });
      }
      const { rows } = await db.query(create_trip_query, values);
      const { trip_id } = rows[0];
      const id = trip_id;
      return res.status(201).json({
        status: 'success',
        data: {
          id,
          bus_id,
          origin,
          destination,
          trip_date: moment(trip_date),
          fare,
          status,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.routine === 'ri_ReportViolation') {
        return res.status(400).json({
          status: 'error',
          error: 'No bus with such ID found',
        });
      }

      if (error.routine === '_bt_check_unique') {
        return res.status(400).json({
          status: 'error',
          error: 'Bus is Active, please use another',
        });
      }
      return res.status(400).json({
        status: 'error',
        error: 'Something went wrong, try again or contact our engineers',
      });
    }
  },
  /**
   * Both Admin and User see all trips
   * @param {object} req
   * @param {object} res
   * @returns {object} bus object
   */
  // eslint-disable-next-line consistent-return
  async getAllTrips(req, res) {
    try {
      const { rows } = await db.query(get_all_trip_query);
      return res.status(200).json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: 'Something went wrong, try again',
      });
    }
  },

  async cancelATrip(req, res) {
    // check for admin user
    if (req.admin === false) {
      return res.status(403).json({
        status: 'error',
        error: 'Unauthorized!',
      });
    }
    try {
      const values = [
        'canceled',
        new Date(),
        req.params.id,
      ];

      const { rows } = await db.query(cancel_a_trip_query, values);
      if (rows.length <= 0) {
        return res.status(404).json({
          status: 'error',
          error: 'No trip found with such ID',
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Trip was cancelled sucessfully',
        data: rows[0],
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: 'Something went wrong, try again',
      });
    }
  },

};

export default Trip;
