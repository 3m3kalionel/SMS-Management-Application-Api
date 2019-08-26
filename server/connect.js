import mongoose from 'mongoose';
import envConfig from './config';

const connect = (config = envConfig) => {
  mongoose.connect(config.db.url, { useNewUrlParser: true })
  .then(() => console.log(`${config.env} db connected`));
}


export default connect;
