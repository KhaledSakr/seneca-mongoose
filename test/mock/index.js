module.exports = {
  valid: {
    uri: 'mongodb://localhost/test',
    options: {
      autoIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0
    }
  },
  invalid: {
    uri: 'mongodb://localhost:27018/test',
    options: {
      autoIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0
    }
  }
}
