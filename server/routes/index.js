import controllers from '../controllers'

const contactController = controllers.contact;
const smsController = controllers.sms;
const userController = controllers.user;

const router = app => {
  // route that creates a new user
  app.post('/api/v1/user', userController.createUser);

  // route that creates a new sms
  app.post('/api/v1/sms', smsController.createMessage);

  // route that creates a new contact
  app.post('/api/v1/contact', contactController.createContact);
  
  // route that gets a particular message
  app.get('/api/v1/user/:userId/sms/:smsId', smsController.getMessage);

  // route that gets a user's messages
  app.get('/api/v1/user/:userId/messages', smsController.getMessages);

  // route that gets a contact in a user's phonebook
  app.get('/api/v1/user/:userId/contact/:contactId', contactController.getContact);

  // route that gets a user's phonebook contacts list
  // app.get('/api/v1/user/:userId/contact/:contactId', contactController.searchContacts);

  // route that updates a contact
  app.put('/api/v1/user/:userId/contact/:contactId', contactController.updateContact);

  // route that deletes a contact
  app.delete('/api/v1/user/:userId/contact/:contactId', contactController.deleteContact)

  // route that deletes a user
  app.delete('/api/v1/user/:userId', userController.deleteUser)
}

export default router;
