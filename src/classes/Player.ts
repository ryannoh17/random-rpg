import { Profile } from '../schemas/profile.js';
import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Inventory } from './Inventory.js';
import { Monster } from './Monster.js'

export class Player {
  userID: string;
  tag: string;
  guildID: string;
  maxHealth: number;
  health: number;
  maxMana: number;
  mana: number;
  strength: number;
  stamina: number;
  defense: number;
  wisdom: number;
  intelligence: number;
  agility: number;
  statPoints: number;
  level: number;
  exp: number;
  maxExp: number;
  monster: Monster | null;
  isFighting: boolean;
  inventory: Inventory;

  private constructor(
    userID: string,
    tag: string,
    guildID: string,
    maxHealth: number,
    health: number,
    maxMana: number,
    mana: number,
    strength: number,
    stamina: number,
    defense: number,
    wisdom: number,
    intelligence: number,
    agility: number,
    statPoints: number,
    level: number,
    exp: number,
    maxExp: number,
    monster: Monster | null,
    isFighting: boolean,
    inventory: Inventory,
  ) {
    this.userID = userID;
    this.tag = tag;
    this.guildID = guildID;
    this.maxHealth = maxHealth;
    this.health = health;
    this.maxMana = maxMana;
    this.mana = mana;
    this.strength = strength;
    this.stamina = stamina;
    this.defense = defense;
    this.wisdom = wisdom;
    this.intelligence = intelligence;
    this.agility = agility;
    this.statPoints = statPoints;
    this.level = level;
    this.exp = exp;
    this.maxExp = maxExp;
    this.monster = monster;
    this.isFighting = isFighting;
    this.inventory = inventory;
  }


  /**
   * loads the player if they exist within the database
   *
   * @param userID - ID specific to each user
   * @param guildID - ID specific to server
   * @returns - The player with specified IDs
   */
  static async load(userID: string, guildID: string): Promise<Player> {
    const storedProfile = await Profile.findOne({
      userId: userID,
      guildId: guildID,
    });

    if (!storedProfile) throw new Error("[ specified profile does not exist ]");

    const newPlayer = new Player(
      storedProfile.userID,
      storedProfile.tag,
      storedProfile.guildID,
      storedProfile.maxHealth,
      storedProfile.health,
      storedProfile.maxMana,
      storedProfile.mana,
      storedProfile.strength,
      storedProfile.stamina,
      storedProfile.defense,
      storedProfile.wisdom,
      storedProfile.intelligence,
      storedProfile.agility,
      storedProfile.statPoints,
      storedProfile.level,
      storedProfile.exp,
      storedProfile.maxExp,
      storedProfile.monster,
      storedProfile.isFighting,
      new Inventory(storedProfile.inventory, storedProfile.coins)
    );

    return newPlayer;
  }

  async save(): Promise<void> {
    await Profile.updateOne(
      { userId: this.userID, guildId: this.guildID },
      {
        maxHealth: this.maxHealth,
        health: this.health,
        maxMana: this.maxMana,
        mana: this.mana,
        strength: this.strength,
        stamina: this.stamina,
        defense: this.defense,
        wisdom: this.wisdom,
        intelligence: this.intelligence,
        agility: this.agility,
        statPoints: this.statPoints,
        level: this.level,
        exp: this.exp,
        maxExp: this.maxExp,
        monster: this.monster,
        isFighting: this.isFighting,
        inventory: this.inventory.items,
        coins: this.inventory.coins
      }
    );
  }


  createFightEmbed() {
    if (!this.monster) throw new Error(`Player currently no fighting monster`);

    const embed = new EmbedBuilder()
      .setTitle(`${this.monster.zone}`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      // .setImage('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Buffs',
          value: '\u200B',
        },
        {
          name: `${this.monster.name}`,
          value: `${this.monster.health}/${this.monster.maxHealth}`,
          inline: true,
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: true,
        },
        {
          name: `${this.tag}`,
          value: `${this.health}/${this.maxHealth}`,
          inline: true,
        },

        {
          name: `\u200B`,
          value: `\u200B`,
        },
      ]);
    // .setFooter({ text: 'nothing to see here', iconURL: 'https://i.stack.imgur.com/Fzh0w.png'});

    return embed;
  };

  async fightMonster(interaction: ChatInputCommandInteraction) {
    const monsterEmbed = this.createFightEmbed();
    
    const swordButton = new ButtonBuilder()
      .setCustomId('sword')
      .setLabel('sword')
      .setStyle(ButtonStyle.Primary);

    const potionButton = new ButtonBuilder()
      .setCustomId('potions')
      .setLabel('potions')
      .setStyle(ButtonStyle.Secondary);

    const nextButton = new ButtonBuilder()
      .setCustomId('nextBattle')
      .setLabel('next')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      swordButton,
      potionButton,
      nextButton
    );

    interaction.reply({
      embeds: [monsterEmbed],
      components: [row],
    });

    await this.save();
  }


  addExp(expPoints: number) {
    this.exp += expPoints;

    const leftover = this.exp - this.maxExp;
    if (leftover >= 0) {
      const newLevel = this.level + 1;
      this.level = newLevel;
      this.statPoints += 1;
      this.maxExp = newLevel * 100;
      this.strength += 1;
      this.maxHealth += 2;
      this.exp = leftover
    };
  }


  die() {
    this.maxHealth = 100
    this.health = 100
    this.maxMana = 0
    this.mana = 0
    this.strength = 10
    this.stamina = 5
    this.defense = 0
    this.wisdom = 0
    this.intelligence = 0
    this.agility = 0
    this.statPoints = 0
    this.level = 1
    this.exp = 0
    this.maxExp = 100
    this.monster = null
    this.isFighting = false
    this.inventory = new Inventory([[], [], []], 0);
  }
}





/* create an async function to create player class and assign all its values
   
   make the inventory class and some make it so it correctly maps to the schema

   move all the functions to the new player and inventory class
*/