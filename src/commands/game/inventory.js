import { SlashCommandBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('brings up inventory'),
  async execute(interaction, client) {
    const { user, guild } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${user.username}'s profile does not exist`,
        ephemeral: true,
      });

    const { inventory, coins } = storedProfile;

    const invSections = await client.giveInvSections(inventory);

    const embed = await client.createInvEmbed(inventory, invSections, coins);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
