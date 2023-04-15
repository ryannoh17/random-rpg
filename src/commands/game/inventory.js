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

    const matArray = inventory[0].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });
    const potionArray = inventory[1].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });
    const equipArray = inventory[2].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    const matList = matArray.join('\n');
    const potionList = potionArray.join('\n');
    const equipList = equipArray.join('\n');

    const embed = await client.createInvEmbed(inventory, matList, potionList, equipList, coins);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
