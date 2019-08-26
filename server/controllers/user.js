import userModel from '../models/userModel';
import { handleError } from '../utils';
import smsModel from '../models/smsModel';

import { validateDocument } from '../utils';

export default class User {
  /**
   * creates a new user using the request body
   * @param {object} req
   * @param {object} res
   * @returns User
   */
  static async createUser(req, res) {
    const { name, phoneNumber } = req.body;
    const newUser = new userModel({ name, phoneNumber });
    return newUser.save(function(error) {
      error && error.errors
      ? handleError(error, res)
      : res.status(201).send({
        status: 'success',
        user: newUser,
      })
    })
  }

  static async deleteUser(req, res) {
    const { userId } = req.params;
    const user = await validateDocument(userModel, userId, { returnPopulated: false });
    await smsModel
    .find()
      .or([{ sender: userId }, { receiver: userId }])
      .deleteMany()
    await user.remove();
    return res.status(200).send({
      status: 'success',
      message: 'deleted!',
    })
  }
}
