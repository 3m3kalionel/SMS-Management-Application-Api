import express from 'express';
import bodyParser from 'body-parser';

import router from './server/routes';
import connect from './server/connect';

// initialise express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router(app)
connect();

// set up express and the default catch-all route
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the contact sms manager app!',
}));

export default app;
