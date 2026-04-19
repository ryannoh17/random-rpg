import type { ItemType } from "../schemas/item.js";

export const MonsterList = [];

type spawnRate = {
  monster: Monster,
  weight: number
}

export class Monster {
  name: string;
  maxHealth: number;
  health: number;
  attack: number;
  drops: ItemType[];
  level: number;
  zone: "Dummy" | "Sunlit Meadow" | "Greenwood";

  constructor(
    name: string,
    maxHealth: number,
    attack: number,
    drops: ItemType[],
    level: number,
    zone: "Dummy" | "Sunlit Meadow" | "Greenwood"
  ) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.attack = attack;
    this.drops = drops;
    this.level = level;
    this.zone = zone;
  }

  static spawn(zone: string): Monster {

    function weightedRandom(spawnRates: spawnRate[]): Monster {
      const totalWeight = spawnRates.reduce((sum, i) => sum + i.weight, 0);
      const rand = Math.random() * totalWeight;

      let cumulative = 0;
      for (const { monster, weight } of spawnRates) {
        cumulative += weight;
        if (rand < cumulative) {
          return monster;
        }
      }

      // fallback (no way)
      return spawnRates[spawnRates.length - 1]!.monster;
    }

    const Dummy: spawnRate[] = [
      {
        monster: new Monster("Dummy", 30, 0, [], 0, "Dummy"),
        weight: 1
      }
    ]

    const SunlitMeadow: spawnRate[] = [
      {
        monster: new Monster('Slime', 60, 5, [], 1, "Sunlit Meadow"),
        weight: 60
      },
      {
        monster: new Monster('Horned Rabbit', 50, 15, [], 3, "Sunlit Meadow"),
        weight: 35
      },
      {
        monster: new Monster('Wild Tusk', 110, 20, [], 5, "Sunlit Meadow"),
        weight: 5
      }
    ]

    const Greenwood: spawnRate[] = [
      {
        monster: new Monster('Goblin', 100, 20, [], 6, "Greenwood"),
        weight: 60
      },
      {
        monster: new Monster('Dire Wolf', 150, 30, [], 8, "Greenwood"),
        weight: 35
      },
      {
        monster: new Monster('Orge', 200, 40, [], 10, "Greenwood"),
        weight: 5
      }
    ]

    let monsters: spawnRate[];

    switch (zone) {
      case "Dummy":
        monsters = Dummy;
        break;
      
      case "Sunlit Meadow":
        monsters = SunlitMeadow;
        break;

      case "Greenwood":
        monsters = Greenwood;
        break;
      
      default:
        throw new Error(`the switch statement failed???`);
    }

    return weightedRandom(monsters);
  }
}

// creating fighting embed - should be under player blehhh
// spawning new monster based off location - spawn method
// monster need to use skills wtfffffff
// create enrage dummy function to double monster damage

// fight method under play which takes monster obeject
// save state of monster object????

// create system to load monster cause creating a new monster every time is dumb