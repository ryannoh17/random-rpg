import { Monster } from "../../../classes/monster.js";
import { itemArray } from "../../../items.js";

export default (client) => {
  client.fromSLM = async () => {
    const int = Math.floor(Math.random() * 100);

    let drops = [];

    switch (true) {
      case int < 39: {
        drops = [itemArray[1]];
        const slime = new Monster('Slime', 60, 5, drops);

        return slime;
      }

      case int < 79: {
        drops = [itemArray[2]];
        const hornedRabbit = new Monster('Horned Rabbit', 50, 15, drops);

        return hornedRabbit;
      }

      case int < 99: {
        drops = [itemArray[4]];
        const wildtusk = new Monster('Wildtusk', 110, 20, drops);

        return wildtusk;
      }
      
      default:
        return null;
    }
  };
};
