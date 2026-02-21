import type { MonsterType } from "../schemas/monster.js";

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
  drops: string[];
  level: number;
  zone: "Dummy" | "Sunlit Meadow" | "Greenwood";

  constructor(
    name: string,
    maxHealth: number,
    health: number,
    attack: number,
    drops: string[],
    level: number,
    zone: "Dummy" | "Sunlit Meadow" | "Greenwood"
  ) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = health;
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
        monster: new Monster("Dummy", 30, 30, 0, [], 0, "Dummy"),
        weight: 1
      }
    ]

    // const sunlitMeadow = [
    //   { monsterName: "Slime", weight: 60 },
    //   { monsterName: "Horned Rabbit", weight: 39 },
    //   { monsterName: "Wild Tusk", weight: 1 }
    // ];

    // switch this shit ig or something
    return weightedRandom(Dummy);
  }
}

// creating fighting embed - should be under player blehhh
// spawning new monster based off location - spawn method
// monster need to use skills wtfffffff
// create enrage dummy function to double monster damage

// fight method under play which takes monster obeject
// save state of monster object????

// create system to load monster cause creating a new monster every time is dumb