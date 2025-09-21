export class Monster {
  name: string;
  maxHealth: number;
  health: number;
  attack: number;
  drops: string[];
  level: number;
  exp: number;

  constructor(
    name: string,
    maxHealth: number,
    health: number,
    attack: number,
    drops: string[],
    level: number,
    exp: number
  ) {
    this.name = name;
    this.maxHealth = health;
    this.health = health;
    this.attack = attack;
    this.drops = drops;
    this.level = level;
    this.exp = exp;
  }
}
