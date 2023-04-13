const Monster = require('../../classes/monster');
const { itemArray } = require('../../items');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fromSLM = async (interaction, row, area) => {
    const int = Math.floor(Math.random() * 100);

    let drops = [];

    switch (true) {
      case int < 39: {
        drops = [itemArray[1]];
        const slime = new Monster('Slime', 60, 5, drops);

        client.fightMonster(interaction, slime, row, area);
        break;
      }

      case int < 79: {
        drops = [itemArray[2]];
        const hornedRabbit = new Monster('Horned Rabbit', 50, 15, drops);

        client.fightMonster(interaction, hornedRabbit, row, area);
        break;
      }

      case int < 99: {
        drops = [itemArray[4]];
        const wildtusk = new Monster('Wildtusk', 110, 20, drops);

        client.fightMonster(interaction, wildtusk, row, area);
        break;
      }
      
      default:
        break;
    }
  };
};
