const Monster = require('../../classes/monster');
const Item = require('../../classes/item');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fromSLM = async (interaction, row) => {
    const int = Math.floor(Math.random() * 100);

    let drops = [];

    switch (true) {
      case int < 39: {
        const slimeDrop = new Item('slime', '002', 1, 2);
        drops = [slimeDrop];
        const slime = new Monster('Slime', 10, 1, drops);

        client.fightMonster(interaction, slime, row);
        break;
      }

      case int < 79: {
        const rabbitHornDrop = new Item('rabbit horn', '003', 4, 1);
        drops = [rabbitHornDrop];
        const hornedRabbit = new Monster('Horned Rabbit', 8, 2, drops);

        client.fightMonster(interaction, hornedRabbit, row);
        break;
      }

      case int < 99: {
        const boarTusk = new Item('boar', '004', 2, 3);
        drops = [boarTusk];
        const wildtusk = new Monster('Wildtust', 15, 2, drops);

        client.fightMonster(interaction, wildtusk, row);
        break;
      }
      
      default:
        break;
    }
  };
};
