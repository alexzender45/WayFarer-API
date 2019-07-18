import { create_user_table } from './user.model';
import { create_bus_table } from './bus.model';
import { create_trip_table } from './trip.model';
import { create_booking_table } from './booking.model';

const createTables = async () => {
  await create_user_table();
  await create_bus_table();
  await create_trip_table();
  await create_booking_table();
};

export default createTables;
