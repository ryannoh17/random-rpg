const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('brings up inventory'),
  async execute(interaction, client) {
    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${interaction.user.username}'s profile does not exist`,
        ephemeral: true,
      });

    const { inventory } = storedProfile;
    const { coins } = storedProfile

    const nameList = inventory.map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    const items = nameList.join('\n');
    const embed = await client.createInvEmbed(inventory, items, coins);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
