const Monster = require('../../classes/monster');
const Item = require('../../classes/item');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fromGNW = async (interaction, row) => {
    const int = Math.floor(Math.random() * 100);

    let drops = [];

    switch (true) {
      case int < 39: {
        const goblinEar = new Item('goblin ear', '002', 1, 2);
        drops = [slimeDrop];
        const slime = new Monster('Slime', 10, 1, drops);

        client.fightMonster(interaction, slime, row);
        break;
      }

      case int < 79: {
        const wolfFur = new Item('rabbit horn', '003', 4, 1);
        drops = [rabbitHornDrop];
        const direWolf = new Monster('Horned Rabbit', 8, 2, drops);

        client.fightMonster(interaction, hornedRabbit, row);
        break;
      }

      case int < 99: {
        const orge = new Item('wolf fur', '004', 2, 3);
        drops = [wolfFur];
        const direWolf = new Monster('Dire Wolf', 12, 3, drops);

        client.fightMonster(interaction, direWolf, row);
        break;
      }
      
      default:
        break;
    }
  };
};
