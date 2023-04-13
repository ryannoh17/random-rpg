const Monster = require('../../classes/monster');
const { itemArray } = require('../../items');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fromGNW = async (interaction, row, area) => {
    const int = Math.floor(Math.random() * 100);

    let drops = [];

    switch (true) {
      case int < 39: {
        drops = [itemArray[5]];
        const goblin = new Monster('Goblin', 100, 20, drops);

        client.fightMonster(interaction, goblin, row, area);
        break;
      }

      case int < 79: {
        drops = [itemArray[3]];
        const direWolf = new Monster('Dire Wolf', 150, 30, drops);

        client.fightMonster(interaction, direWolf, row, area);
        break;
      }

      case int < 99: {
        drops = [itemArray[6]]; 
        const ogre = new Monster('Dire Wolf', 200, 40, drops);

        client.fightMonster(interaction, ogre, row, area);
        break;
      }
      
      default:
        break;
    }
  };
};
