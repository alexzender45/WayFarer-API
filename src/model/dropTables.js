/* eslint-disable camelcase */
import { drop_user_table } from './user.model';
import { drop_bus_table } from './bus.model';
import { drop_trip_table } from './trip.model';
import { drop_booking_table } from './booking.model';

const dropTables = async () => {
  await drop_user_table();
  await drop_bus_table();
  await drop_trip_table();
  await drop_booking_table();
};
export default dropTables;
