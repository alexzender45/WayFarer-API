import express from 'express';
import bodyParser from 'body-parser';
import Debug from 'debug';
import dotenv from 'dotenv';
import cors from 'cors';
// import user from './src/routes/user.route';
// import Trip from './src/routes/trip.route';
// import Bus from './src/routes/bus.route';
// import Booking from './src/routes/booking.route';

dotenv.config();
const app = express();
const logger = new Debug('http');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/api/v1/auth', user);
// app.use('/api/v1/', Trip);
// app.use('/api/v1/', Bus);
// app.use('/api/v1', Booking);

app.get('', (req, res) => {
  res.send('connected');
});
const port = process.env.PORT || 6000;
const server = app.listen(port, () => logger(`App runing on ${port}`));

module.exports = server;
