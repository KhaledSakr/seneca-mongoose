/*
 * @Name: SenecaMongoose
 * @Description: Seneca plugin to be a layer to mongoose Lib
 * @Author: Steven Ceuppens
 * @Contributor: FelipeBarrosCruz<felipe.barros.pt@gmail.com>
 * @Version: 1.0.1
 * @Date: [2018-03-16]
 */


module.exports = function SenecaMongoose (params) {
  const seneca = this
  const name = 'seneca-mongoose'
  const Mongoose = require('mongoose')
  const Joi = require('joi')
  const DEFAULT_PARAMS = {
    uri: 'mongodb://localhost:27017',
    options: {
      autoIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0
    }
  }

  seneca.add({ init: name }, constructor)

  function constructor (args, done) {
    const isValid = validatePluginOptions(params)
    if (isValid.error) {
      seneca.log.fatal(name, isValid.error)
      throw isValid.error
    }
    const data = Object.assign({}, DEFAULT_PARAMS, params)
    const connection = Mongoose.connect(data.uri, data.options)

    connection.then(() => {
      seneca.log.info(name, 'CONNECTION ESTABLISHED WITH SUCCESS')
      seneca.decorate('mongoose', connection)
      return done(null)
    }).catch((err) => {
      seneca.log.fatal(name, err)
      return done(err)
    })
  }

  function validatePluginOptions (params) {
    const schema = {
      uri: Joi.string()
        .required()
        .description('the database uri to connect'),

      options: Joi.object().keys({
        autoIndex: Joi.boolean()
          .optional()
          .description('the option to auto build indexes'),

        reconnectTries: Joi.number()
          .optional()
          .description('the option to set max tries to reconnect'),

        reconnectInterval: Joi.number()
          .integer()
          .optional()
          .description('the option to set the reconnect interval'),

        poolSize: Joi.number()
          .integer()
          .optional()
          .description('the option to set the socket connection'),

        bufferMaxEntries: Joi.number()
          .integer()
          .optional()
          .description('the option to set the maximum entries of buffer')
      }).optional()
    }
    return Joi.validate(params, schema, { abortEarly: false })
  }

  return {
    name
  }
}
