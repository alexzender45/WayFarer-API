// /* eslint-disable no-undef */
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import faker from 'faker';
// import app from '../index';


// // Define the expect assertion
// const { expect } = chai;
// // chai middleware
// chai.use(chaiHttp);
// const bus = {
//   model: 'Hiace',
//   manufacturer: 'Toyota',
//   year: '2012',
//   numberPlate: 'fh3du5',
//   capacity: 16,
// };
// const adminUser = {
//   first_name: 'Samuel',
//   last_name: 'Olaoye',
//   email: faker.internet.email(),
//   password: 'password',
//   is_admim: 'admin',
// };

// const signinUrl = '/api/v1/auth/signin';
// const busUrl = '/api/v1/trip/bus';
// let adminToken;

// describe('Bus controller', () => {
//   it('should login an admin', (done) => {
//     chai
//       .request(app)
//       .post(signinUrl)
//       .send(adminUser)
//       .end((err, res) => {
//         const { body } = res;
//         expect(body.data).to.equal('object');
//         done();
//       });
//   });

//   it('should create a new bus', (done) => {
//     chai
//       .request(app)
//       .post(busUrl)
//       .set('token', adminToken)
//       .send(bus)
//       .end((err, res) => {
//         const { body } = res;
//         adminToken = body.data.token;
//         expect(res.status).to.equal(201);
//         done();
//       });
//   });
// });
