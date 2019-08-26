import contactModel from '../models/contactModel';
import userModel from '../models/userModel';
import smsModel from '../models/smsModel';

import { handleError, validateDocument } from '../utils';

export default class Contact {
  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @memberof Contact
   */
  static async createContact(req, res) {
    const { name, phoneNumber, owner } = req.body;
    const user = await validateDocument(userModel, owner, {
      returnPopulated: false,
      modelName: 'user',
    }, res);

    if (user && !user.statusCode) {
      const newContact = new contactModel({
        name,
        phoneNumber,
        owner: owner,
      })
      
      newContact.save(function(error) {
        error && error.errors
        ? handleError(error, res)
        : res.status(201).send({
          status: 'success',
          contact: newContact,
        })
      })
    }
  }

  static async getContact(req, res) {
    const { userId, contactId } = req.params;
    const owner = await validateDocument(userModel, userId, {
      returnPopulated: false 
    }, res);
    const contact = await validateDocument(contactModel, contactId, {
      returnPopulated: false
    }, res);

    
    if (owner && !owner.statusCode && contact && !contact.statusCode) {
      return res.status(200).send({
        status: 'success',
        contact,
      })
    }
  }

  static async deleteContact(req, res) {
    const { userId, contactId } = req.params;
    const owner = await validateDocument(userModel, userId, { returnPopulated: false });
    const contact = await validateDocument(contactModel, contactId, { returnPopulated: false });

    if (owner && !owner.statusCode && contact && !contact.statusCode) {
      await smsModel.deleteMany({ receiver: contactId});
      await contact.remove();
      return res.status(200).send({
        status: 'success',
        message: 'deleted!',
      })
    }
  }

  static async updateContact(req, res) {
    const { userId, contactId } = req.params;
    const owner = await validateDocument(userModel, userId, {
      returnPopulated: false,
    }, res);
    const contact = await validateDocument(contactModel, contactId, {
      returnPopulated: false,
    }, res);

      if (owner && !owner.statusCode && contact && !contact.statusCode) {
        const { name, phoneNumber } = contact;

        contact.name = req.body.name || name;
        contact.phoneNumber = req.body.phoneNumber || phoneNumber;
        
        await contact.save();
        return res.status(200).send({
          status: 'success',
          contact
        })
      }
  }
}
