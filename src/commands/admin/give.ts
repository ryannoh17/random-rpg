import {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Profile } from "../../schemas/profile.js";
import { itemArray } from "../../items.js";

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

    if (user.id !== "449357416287567873")
      return interaction.reply("not an admin can not use");

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild!.id,
    });

    if (!storedProfile) 
      return interaction.reply("user does not exist");

    const { inventory, _id } = storedProfile;

    const itemName = await interaction.options.getString("item");
    const itemAmount = await interaction.options.getInteger("amount")!;

    const selectedItem = itemArray.find((item) => item.name === itemName);

    if (!selectedItem) {
      return interaction.reply({
        content: `${itemName} does not exist`,
        ephemeral: true,
      });
    }

    selectedItem.quantity = itemAmount;

    await client.addToInv(inventory, [selectedItem], _id);

    return interaction.reply({
      content: `${itemAmount} ${itemName} given`,
      ephemeral: true,
    });
  },
};
