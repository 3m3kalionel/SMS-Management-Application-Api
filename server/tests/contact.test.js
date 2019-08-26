import supertest from 'supertest'
import app from '../../app'
import connect from '../connect'
import should from 'should'
import mongoose from 'mongoose'
import contactModel from '../models/contactModel'
import userModel from '../models/userModel'

let owner;
let existingUser
const server =  supertest(app)

before(async () => {
  let users = [
    { name: 'pythagoras', phoneNumber: '39488593'},
    { name: 'okoro', phoneNumber: '39925883'},
    { name: 'phylis', phoneNumber: '4444'},
    { name: 'dpg', phoneNumber: '56663'},
  ]

  await mongoose.connection.dropDatabase();
  await userModel.insertMany(users);
  existingUser = await userModel.find({ name: 'okoro' })
  owner = existingUser[0]._id;

  let contacts = [
    { name: 'dev_2.0', phoneNumber: '2748814', owner: owner },
    { name: 'petrel', phoneNumber: '3998837', owner: owner },
  ];

  await contactModel.insertMany(contacts);
})

describe('Contact Model', () => {
  it('creates a new contact', async () => {
    const res = await server
    .post('/api/v1/contact')
    .send({ name: 'supermike', phoneNumber: '12345678', owner: owner })
      res.status.should.equal(201);
      res.body.status.should.equal('success');
      res.body.contact.name.should.equal('supermike');
      res.body.contact.phoneNumber.should.equal('12345678');
  });

  it('prevents creating a contact if the name is already in use', async () => {
    const res = await server
      .post('/api/v1/contact')
      .send({ name: 'dev_2.0', phoneNumber: '1234567998', owner });

    res.status.should.equal(400);
    res.body.status.should.equal('failed');
    res.body.message.should.equal('name dev_2.0 is already taken');
  })

  it('prevents creating a contact if the phone number is already in use', async () => {
    const res = await server
      .post('/api/v1/contact')
      .send({ name: 'ij', phoneNumber: '2748814', owner })

    res.status.should.equal(400);
    res.body.status.should.equal('failed');
    res.body.message.should.equal('Another contact exists with the same phone number');

  })

  it('prevents creating a contact if the name isn\'t provided', async () => {
    const res = await server
      .post('/api/v1/contact')
      .send({ phoneNumber: '12345678', owner });

    res.status.should.equal(400);
    res.body.status.should.equal('failed');
    res.body.message.should.equal('Please enter the contact\'s name');
  })

  it('prevents creating a user if the phone number isn\'t procided', async () => {
    const res = await server
      .post('/api/v1/contact')
      .send({ name: 'alan', owner });

    res.status.should.equal(400);
    res.body.status.should.equal('failed');
    res.body.message.should.equal('Please enter the contact\'s phone number');
  })

  it('prevents creating a user if the owner id isn\'t provided', async () => {
    const res = await server
      .post('/api/v1/contact')
      .send({ name: 'alan', phoneNumber: '123345678', owner: '' });

      res.status.should.equal(400);
      res.body.status.should.equal('failed');
      res.body.message.should.equal('user(id) isn\'t a valid mongoose document id');
  });

  it('finds a particular user\'s contact', async () => {
    let searchResult = await contactModel.find({ name: 'dev_2.0' });

    const res = await server
      .get(`/api/v1/user/${owner}/contact/${searchResult[0]._id}`);

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.contact.name.should.equal('dev_2.0');
  })

  it('updates a particular user\'s contact', async () => {
    let searchResult = await contactModel.find({ name: 'dev_2.0' });
    const res = await server
      .put(`/api/v1/user/${owner}/contact/${searchResult[0]._id}`)
      .send({ name: 'dev_2.0_updated', phoneNumber: '987654321' });

    res.status.should.equal(200);
    res.body.status.should.equal('success')
    res.body.contact.name.should.equal('dev_2.0_updated');
    res.body.contact.phoneNumber.should.equal('987654321');
  })

  it('deletes a user\'s contact', async () => {
    let searchResult = await contactModel.find({ name: 'petrel' });
    const res = await server
      .delete(`/api/v1/user/${owner}/contact/${searchResult[0]._id}`);

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.message.should.equal('deleted!');
  })
})
