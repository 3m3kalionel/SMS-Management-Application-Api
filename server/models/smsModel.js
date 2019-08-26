import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import { isEmpty } from '../utils';

const smsSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please enter the sender\'s id'],
    ref: 'User'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please enter the reveiver\'s id'],
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['User', 'Contact']
  },
  content: {
    type: String,
    required: [true, 'Can\'t send an empty message'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: () => {
        return 'Can\'t send an empty message. Please enter some content'
      }
    },
  },
  status: {
    type: String,
  }
})

smsSchema.plugin(beautifyUnique)
export default mongoose.model('Sms', smsSchema);
