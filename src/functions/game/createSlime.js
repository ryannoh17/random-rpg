const Monster = require('../../classes/monster');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.createSlime = async () => {
    const slime = new Monster('slime', 5, 1);

    return slime;
  };
};
