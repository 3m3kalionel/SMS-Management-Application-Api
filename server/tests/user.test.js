import supertest from 'supertest';
import app from '../../app';
import connect from '../connect';
import should from 'should';
import mongoose from 'mongoose';
import userModel from '../models/userModel';

const server = supertest(app);
let userId;

before(async () => {
  let user = await userModel.create({ name: 'moses', phoneNumber: '88u7uf' });
  userId = user._id
})

describe('User routes', () => {

  it('displays a response message at the API root', done => {
    server
      .get('/')
      .end((err, res) => {
        res.body.message.should.equal('Welcome to the contact sms manager app!');
        done();
      })
  })

  it('creates a new user', (done) => {
    server
      .post('/api/v1/user')
      .send({ name: 'emeka', phoneNumber: '12345678' })
      .end((err, res) => {
        res.status.should.equal(201);
        res.body.user.name.should.equal('emeka');
        res.body.user.phoneNumber.should.equal('12345678');
        res.body.status.should.equal('success');
        done();
      })
  })

  it('prevents creating a user if the name is already in use', (done) => {
    server
      .post('/api/v1/user')
      .send({ name: 'moses', phoneNumber: '12345678' })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.equal('failed')
        res.body.message.should.equal('name moses is already taken');
        done();
      })
  })

  it('prevents creating a user if the phone number is already in use', (done) => {
    server
      .post('/api/v1/user')
      .send({ name: 'gh', phoneNumber: '88u7uf' })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.equal('failed')
        res.body.message.should.equal('Another user exists with the same phone number');
        done();
      })
  })

  it('throws an error if the name isn\'t provided', done => {
    server
      .post('/api/v1/user')
      .send({ phoneNumber: '1234567890' })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.equal('failed')
        res.body.message.should.equal('Please enter the user\'s name')
        done();
      });
  })

  it('throws an error if the phone number isn\'t provided', done => {
    server
    .post('/api/v1/user')
    .send({ name: 'shizzo' })
    .end((err, res) => {
      res.status.should.equal(400);
      res.body.status.should.equal('failed')
      res.body.message.should.equal('Please enter the user\'s phone number')
      done();
    });
  })

  it('deletes a user', done => {
    server
      .delete(`/api/v1/user/${userId}`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('deleted!')
      })
      done();
  })
})
