const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
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
