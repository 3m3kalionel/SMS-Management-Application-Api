import devConfig from './development';
import prodConfig from './production';
import testConfig from './testing';
import dotenv from 'dotenv'

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  port: 8080,
  secret: {},
  db: {
    url: 'mongodb://localhost/contact-sms-manager-dev',
  },
};

let appConfig = {};

switch(env) {
  case 'development':
  case 'dev':
    appConfig = devConfig;
    break;
  case 'test':
    appConfig = testConfig;
    break;
  case 'production':
    appConfig = prodConfig;
    break;
  default:
    appConfig = devConfig;
}

const envConfig = Object.assign(baseConfig, appConfig);
envConfig.env = env;
console.log('environment', env)

export default envConfig;
