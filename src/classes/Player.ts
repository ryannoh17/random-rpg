import { Profile } from '../schemas/profile.js';
import { Inventory } from './Inventory.js';
import { Monster } from './monster.js';

export class Player {
    userID: number;
    tag: string;
    guildID: number;
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
    coins: number;

    private constructor(
        userID: number,
        tag: string,
        guildID: number,
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
        isFighting: boolean,
        inventory: Inventory,
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
        this.monster = null;
        this.isFighting = isFighting;
        this.inventory = inventory;
        this.coins = coins;
    }

    /**
     * creates a new Player profile into the database
     *
     * @param userID - ID specific to each user
     * @param tag - name of the user
     * @param guildID - ID specific to each server
     * @returns - 1 if a new player profile is create 0 otherwise
     */
    static async create(userID: number, tag: string, guildID: number): Promise<number> {
        const storedProfile = await Profile.findOne({
            userId: userID,
            guildId: guildID,
        });

        if (storedProfile) return 0;

        const newProfile = await Profile.create(
          { userID: userID, tag: tag, guildID: guildID }
        );

        return 1;
    }

    /**
     * finds the player if they exist within the database
     *
     * @param userID - ID specific to each user
     * @param guildID - ID specific to server
     * @returns - The player with specified IDs
     */
    static async find(userID: number, guildID: number): Promise<Player | null> {
        const storedProfile = await Profile.findOne({
            userId: userID,
            guildId: guildID,
        });

        if (!storedProfile) return null;

        const newInventory = new Inventory(storedProfile);

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
            storedProfile.isFighting,
            newInventory,
            storedProfile.coins
        );

        return newPlayer;
    }
}

/* create an async function to create player class and assign all its values
   
   make the inventory class and some make it so it correctly maps to the schema

   move all the functions to the new player and inventory class
*/
