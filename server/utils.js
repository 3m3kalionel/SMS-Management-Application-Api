import mongoose from 'mongoose';

export const isEmpty = fieldValue => {
  return !(fieldValue.trim().length === 0);
}

export const handleError = ({ errors }, res) => {
  const modelErrors = Object.keys(errors);

  return res.status(400).send({
    status: 'failed',
    message: errors[modelErrors.shift()].message,
  });
}

export async function validateDocument (model, documentId, queryOptions, res) {
  const error = new Error();
  error.status = 'failed'
  const { returnPopulated, userId, modelName } = queryOptions;

  let document;

  try {
    if(!mongoose.Types.ObjectId.isValid(documentId)) {
      error.code = 400;
      error.message = `${modelName}(id) isn\'t a valid mongoose document id`;
      throw error;
    }

    document = await model.findById(documentId);

    if (!document) {
      error.code = 404;
      error.message = `${modelName}(id) not found`;
      throw error;
    }
    if (returnPopulated) {
      document = await model.findById(documentId)
      .populate('owner')
    }

    return document
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.code = 400;
      error.message = `${modelName}(id) isn\'t a valid mongoose document id`;
      return res.send({
        status: error.status,
        message: error.message,
      })
    } else if (error.message.includes('isn\'t a valid mongoose document id')) {
      return res.status(error.code).send({
        status: error.status,
        message: error.message,
      })
    }
    res.status(error.code).send({
      status: error.status,
      message: error.message,
    })
  }
}
