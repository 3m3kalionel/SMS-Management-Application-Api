import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import { isEmpty } from '../utils';


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the contact\'s name'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: props => {
        return `input is not a valid ${props.path}`
      }
    },
    unique: '{PATH} {VALUE} is already taken'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please enter the contact\'s phone number'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: () => {
        return `input is not a valid phone number`
      }
    },
    unique: 'Another contact exists with the same phone number',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Contact owner(id) is required'],
    ref: 'User',
  },
})

contactSchema.plugin(beautifyUnique)

export default mongoose.model('Contact', contactSchema);
