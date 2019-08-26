import smsModel from '../models/smsModel';
import userModel from '../models/userModel'
import contactModel from '../models/contactModel'
import { handleError, validateDocument } from '../utils';


export default class Sms {
  /**
   * creates a new sms document
   * @param {object} req 
   * @param {object} res 
   * @returns
   */
  static async createMessage(req, res) {
    const { sender, receiver, content, status, onModel } = req.body;
    const user = await validateDocument(userModel, sender, {
      returnPopulated: false,
      modelName: 'user',
    }, res);

    if (user && !user.statusCode) {
      const newSms = await smsModel.create({
        sender,
        receiver,
        content,
        status,
        onModel,
      })
      
      return res.status(201).send({
        status: 'success',
        sms: newSms,
      })
    }
  }


  static async getMessage(req, res) {
    const { userId, smsId } = req.params;
    const user = await validateDocument(userModel, userId, {
      returnPopulated: false,
      modelName: 'user',
    }, res);
    const sms = await validateDocument(smsModel, smsId, {
      returnPopulated: true,
      userId,
      modelName: 'sms'
    }, res);

    if (user && !user.statusCode && sms && !sms.statusCode) {
      return res.status(200).send({
        status: 'success',
        message: sms
      })
    }
  }

  static async getMessages(req, res) {
    const { userId, smsId } = req.params;

    const user = await validateDocument(userModel, userId, {
      returnPopulated: false,
      modelName: 'user',
    }, res)

    if (user && !user.statusCode) {
      const smsList = await smsModel.find()
      .or([{ sender: userId }, { receiver: userId }])
      .populate('sender', ['-__v'])
      .populate('receiver', ['-__v', '-owner'])
      return res.status(200).send({
        status: 'success',
        messages: smsList
      })
    }
  }
}
