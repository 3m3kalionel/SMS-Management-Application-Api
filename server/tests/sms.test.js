import supertest from 'supertest'
import app from '../../app'
import connect from '../connect'
import should from 'should'
import mongoose from 'mongoose'
import contactModel from '../models/contactModel'
import userModel from '../models/userModel'
import smsModel from '../models/smsModel'
import { log } from 'async';

let userOne
let userTwo;
let userOneId;
let userTwoId;
let existingContactId;
let existingContact
let sms;
let smsId;
const server =  supertest(app)

before(async () => {
  let users = [
    { name: 'papoose', phoneNumber: '847493'},
    { name: 'nasir', phoneNumber: '00483739'},
  ]

  await userModel.insertMany(users);
  userOne = await userModel.find({ name: 'papoose' });
  userTwo = await userModel.find({ name: 'nasir' })

  userOneId = userOne[0]._id;
  userTwoId = userTwo[0]._id;

  
  let contacts = [
    { name: 'nasty_nas', phoneNumber: '27458814', owner: userOneId },
    { name: '_petrel', phoneNumber: '39983837', owner: userOneId },
  ];

  await contactModel.insertMany(contacts);
  existingContact = await contactModel.find({ name: 'nasty_nas' });

  existingContactId = existingContact[0]._id;

  sms =  await smsModel.create({
    sender: userOneId,
    receiver: userTwoId,
    onModel: 'Contact',
    content: 'test sms',
  })
  smsId = sms._id
})

describe('Sms Model', () => {
  it('creates an sms between a user and a contact', async () => {
    const res = await server
    .post('/api/v1/sms')
    .send({
      sender: userOneId,
      receiver: existingContactId,
      onModel: 'Contact',
      content: 'Hello Nas!'
    })

    res.status.should.equal(201);
    res.body.status.should.equal('success')
    res.body.sms.content.should.equal('Hello Nas!');
  })

  it('prevents a message without a sender from being sent', async () => {
    const res = await server
    .post('/api/v1/sms')
    .send({
      receiver: existingContactId,
      onModel: 'Contact',
      content: 'Hello Nas!'
    })

    res.status.should.equal(400);

    res.body.status.should.equal('failed')
    res.body.message.should.equal('user(id) isn\'t a valid mongoose document id')
  })

  it('sends an sms between two users', async () => {
    const res = await server
    .post('/api/v1/sms')
    .send({
      sender: userOneId,
      receiver: userTwoId,
      onModel: 'User',
      content: 'Yo wassup!'
    })

    res.status.should.equal(201);
    res.body.status.should.equal('success')
    res.body.sms.content.should.equal('Yo wassup!');
  })

  it('fetches a particular message', async () => {
    const res = await server
    .get(`/api/v1/user/${userOneId}/sms/${smsId}`)

    res.status.should.equal(200);
    res.body.status.should.equal('success')
    res.body.message.content.should.equal('test sms');
  })

  it('fetches a user\'s messages', async () => {
    const res = await server
    .get(`/api/v1/user/${userOneId}/messages`)

    res.status.should.equal(200);
    res.body.status.should.equal('success')
  })

  it('returns an error if document id is invalid', async () => {
    const res = await server
      .get(`/api/v1/user/${userOneId}/sms/33388jf`)
    
      res.status.should.equal(400)
      res.body.status.should.equal('failed')
      res.body.message.should.equal('sms(id) isn\'t a valid mongoose document id')
  })
})
