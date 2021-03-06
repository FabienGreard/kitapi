module.exports = {
  // Configuring Mailgun API for sending transactional email
  mailgun_priv_key: 'key-b2b641004485d41b0a63815365c9da7d',
  // Configuring Mailgun domain for sending transactional email
  mailgun_domain: 'sandbox7416171c2f404415a2a93fd87c0e5308.mailgun.org',
  // Secret key for JWT signing and encryption
  'secret': '123456',
  // Database connection information
  'uri': 'mongodb://localhost:27017/kitapi',
  // mongoose option
  'option': {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  },
  // Setting port for server
  'port': process.env.PORT || 8000
}
