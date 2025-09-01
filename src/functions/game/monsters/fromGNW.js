import { Monster } from "../../../classes/monster.js";
import { itemArray } from "../../../items.js";

export default (client) => {
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
        return null;
    }
  };
};
