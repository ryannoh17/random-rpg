import {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Profile } from "../../schemas/profile.js";
import { itemArray } from "../../items.js";
import { Player } from "../../classes/Player.js"

export default {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("gives items")
    .addStringOption((option) =>
      option.setName("item").setDescription("input an item").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("input an amount")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const { user, guild } = interaction;
    const userID = user.id;

    if (guild == null) {
      return interaction.reply("user not in a server");
    }
    const guildID = guild.id;

    if (user.id !== "449357416287567873")
      return interaction.reply("not an admin can not use");

    const itemName = interaction.options.getString("item");
    const itemAmount = interaction.options.getInteger("amount")!;

    const selectedItem = itemArray.find((item) => item.name === itemName);
    if (!selectedItem) {
      return interaction.reply({
        content: `${itemName} does not exist`,
        ephemeral: true,
      });
    }
    selectedItem.quantity = itemAmount;

    let player: Player;
    try {
      player = await Player.load(userID, guildID);
      player.addToInventory([selectedItem]);
    } catch (error) {
      console.error(error);
      return await interaction.reply("user does not exist");
    }

    try {
      await player.savePlayer();
    } catch (error) {
      console.error(error);
    }

    return interaction.reply({
      content: `${itemAmount} ${itemName} given`,
      ephemeral: true,
    });
  },
};
