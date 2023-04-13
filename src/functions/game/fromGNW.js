const Monster = require('../../classes/monster');
const { itemArray } = require('../../items');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fromGNW = async () => {
    const int = Math.floor(Math.random() * 100);

    let drops = [];

    switch (true) {
      case int < 39: {
        drops = [itemArray[5]];
        const goblin = new Monster('Goblin', 100, 20, drops);

        return goblin;
      }

      case int < 79: {
        drops = [itemArray[3]];
        const direWolf = new Monster('Dire Wolf', 150, 30, drops);

        return direWolf;
      }

      case int < 99: {
        drops = [itemArray[6]]; 
        const ogre = new Monster('Ogre', 200, 40, drops);

        return ogre;
      }
      
      default:
        break;
    }
  };
};
