'use strict'

const Lab = require('lab')
const Seneca = require('seneca')
const SenecaMongoosePlugin = require('../')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = require('chai').expect

const Mock = require('./mock')
let senecaInstance = null
let model = null
const Mongoose = require('mongoose')

var createSenecaInstance = function (params) {
  return new Promise((resolve, reject) => {
    const service = Seneca({ log: 'silent' })
      .use(SenecaMongoosePlugin, params)
      .test(reject)
      .ready((err) => {
        if (err) {
          return reject(err)
        }
        return resolve(service)
      })
  })
}

describe('seneca-mongoose', function () {
  it('Expect validation error because the config is empty', () => {
    return new Promise((resolve, reject) => {
      createSenecaInstance({})
        .catch((err) => {
          expect(typeof err).to.be.equal('object')
          expect(err.isJoi).to.be.equal(true)
          expect(err.name).to.be.equal('ValidationError')
          return resolve(null)
        })
    })
  })

  it('Expect to not have a valid seneca instance', () => {
    return new Promise((resolve, reject) => {
      createSenecaInstance(Mock.invalid).catch((err) => {
        expect(typeof err).to.be.equal('object')
        expect(err.name).to.be.equal('MongoNetworkError')
        resolve(null)
      })
    })
  })

  it('Expect to have a valid seneca instance', () => {
    return new Promise((resolve, reject) => {
      createSenecaInstance(Mock.valid)
        .then((instance) => {
          senecaInstance = instance
          resolve(null)
        })
        .catch(reject)
    })
  })

  it('Expect to have valid seneca instance', () => {
    return new Promise((resolve, reject) => {
      createSenecaInstance(Mock.valid)
        .then((instance) => {
          senecaInstance = instance
          resolve(null)
        })
    })
  })

  it('Expect to have mongoose instance', () => {
    return new Promise((resolve, reject) => {
      const connection = senecaInstance.mongoose
      connection
        .then((instance) => {
          expect(instance.constructor.name).to.be.equal('Mongoose')
          resolve(null)
        })
        .catch(reject)
    })
  })

  it('Expect to define a new model', () => {
    return new Promise((resolve, reject) => {
      model = Mongoose.model('Cat', { name: String })
      resolve(null)
    })
  })

  it('Expect to create a new collection and data value', () => {
    return new Promise((resolve, reject) => {
      const kitty = new model({ name: 'Zildjian' })
      kitty.save().then(resolve).catch(reject)
    })
  })

  it('Expect to remove the new collection has create previosly', () => {
    return new Promise((resolve, reject) => {
      model.collection.drop().then(resolve).catch(reject)
    })
  })
})
