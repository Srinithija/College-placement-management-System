const app = require('../app');

module.exports = async (req, res) => {
  await app(req, res);
};