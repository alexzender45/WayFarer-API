/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';

const onEmail = {
  first_name: 'Adewale',
  last_name: 'Olaoye',
  password: 'password',
};

const adminUser = {
  first_name: 'Samuel',
  last_name: 'Olaoye',
  email: faker.internet.email(),
  password: 'password',
  is_admim: 'admin',
};
const incorrectUser = {
  first_name: 'Samuel',
  last_name: 'Olaoye',
  email: faker.internet.email(),
  password: 'passwordr',
};

// Define the expect assertion
const { expect } = chai;

// chai middleware
chai.use(chaiHttp);

const signupUrl = '/api/v1/auth/signup';
const signinUrl = '/api/v1/auth/signin';

// signup test

describe(`POST ${signupUrl}`, () => {
  it('should sign up user successfully', (done) => {
    chai
      .request(app)
      .post(signupUrl)
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });
});
describe(`POST ${signupUrl}`, () => {
  it('should not signup user with incomplete credentails', (done) => {
    chai
      .request(app)
      .post(signinUrl)
      .send(onEmail)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });
});


// signin test
describe(`POST ${signinUrl}`, () => {
  it('should sign in user successfully', (done) => {
    chai
      .request(app)
      .post(signinUrl)
      .send(adminUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        done();
      });
  });
});
describe(`POST ${signinUrl}`, () => {
  it('should not signin user with incorrect password or email', (done) => {
    chai
      .request(app)
      .post(signinUrl)
      .send(incorrectUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        done();
      });
  });
});
