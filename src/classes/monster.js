class Monster {
  constructor(name, health, attack, drops, level, exp) {
    this.name = name;
    this.maxHealth = health;
    this.health = health;
    this.attack = attack;
    this.drops = drops;
    this.level = level;
    this.exp = exp;
  }
}

module.exports = Monster;
