import { Profile } from '../schemas/profile.js';
import { type ItemType } from '../schemas/item.js'
import { type MonsterType } from '../schemas/monster.js';
import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";


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
  monster: MonsterType | null;
  isFighting: boolean;
  inventory: ItemType[][];
  coins: number;

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
    monster: MonsterType | null,
    isFighting: boolean,
    inventory: ItemType[][],
    coins: number
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
    this.coins = coins;
  }

  // /**
  //  * creates a new Player profile into the database
  //  *
  //  * @param userID - ID specific to each user
  //  * @param tag - name of the user
  //  * @param guildID - ID specific to each server
  //  * @returns - 1 if a new player profile is create 0 otherwise
  //  */
  // static async create(userID: number, tag: string, guildID: number): Promise<number> {
  //     const storedProfile = await Profile.findOne({
  //         userId: userID,
  //         guildId: guildID,
  //     });

  //     if (storedProfile) return 0;

  //     const newProfile = await Profile.create(
  //       { userID: userID, tag: tag, guildID: guildID }
  //     );

  //     return 1;
  // }

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
      storedProfile.inventory,
      storedProfile.coins
    );

    return newPlayer;
  }

  private async addItem(invIndex: number, itemToAdd: ItemType): Promise<void> {
    let invSegment = this.inventory[invIndex];

    if (!invSegment) throw new Error("invIndex out of inventory bounds");

    let itemIndex = invSegment.findIndex((currItem) => currItem.id === itemToAdd.id);

    if (itemIndex === -1) {
      invSegment.push(itemToAdd);
    } else {
      if (invSegment[itemIndex]) {
        invSegment[itemIndex].quantity += itemToAdd.quantity;
      }
    }

  }

  async addToInventory(itemsToAdd: ItemType[]): Promise<void> {
    for (const currItem of itemsToAdd) {
      switch (currItem.type) {
        case "material":
          this.addItem(0, currItem);
          break;
        case "potion":
          this.addItem(1, currItem);
          break;
        case "equipment":
          this.addItem(2, currItem);
          break;
      }
    }
  }

  private mapInventorySection(sectionIndex: number) {
    const sectionArray = this.inventory[sectionIndex]!.map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    return sectionArray;
  }

  createInvEmbed() {
    const coinAmount = this.coins;
    

    const embed = new EmbedBuilder()
      .setTitle(`Inventory`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Coins',
          value: `${coinAmount}`,
        },
        {
          name: 'Materials',
          value: `\u200B`,
          inline: true,
        },
        {
          name: 'Potions',
          value: `\u200B`,
          inline: true,
        },
        {
          name: 'Equipment',
          value: `\u200B`,
          inline: true,
        },
      ]);

    if (this.inventory[0]!.length > 0) {
      embed.spliceFields(1, 1, {
        name: 'Materials',
        value: `${this.mapInventorySection(0)}`,
        inline: true,
      });
    }
    if (this.inventory[1]!.length > 0) {
      embed.spliceFields(2, 1, {
        name: 'Potions',
        value: `${this.mapInventorySection(1)}`,
        inline: true,
      });
    }
    if (this.inventory[2]!.length > 0) {
      embed.spliceFields(3, 1, {
        name: 'Equipment',
        value: `${this.mapInventorySection(2)}`,
        inline: true,
      });
    }

    return embed;
  }

  async savePlayer(): Promise<void> {
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
        inventory: this.inventory,
        coins: this.coins
      }
    );
  }

  private createFightEmbed(monster: MonsterType) {
    const embed = new EmbedBuilder()
      .setTitle(`${monster.zone}`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      // .setImage('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Buffs',
          value: '\u200B',
        },
        {
          name: `${monster.name}`,
          value: `${monster.health}/${monster.maxHealth}`,
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

  async fightMonster(interaction: ChatInputCommandInteraction, monster: MonsterType) {
    const monsterEmbed = this.createFightEmbed(monster);

    this.monster = monster
    this.savePlayer();

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

    return interaction.reply({
      embeds: [monsterEmbed],
      components: [row],
    });

  }
}





/* create an async function to create player class and assign all its values
   
   make the inventory class and some make it so it correctly maps to the schema

   move all the functions to the new player and inventory class
*/