const { ButtonBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'nextBattle',
  },

  async execute(interaction, client) {
    const { user, guild, message } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const embed = await client.createFightEmbed(
      storedProfile.monster,
      user.username,
      storedProfile
    );

    const newButton = ButtonBuilder.from(
      message.components[0].components[0]
    ).setDisabled(false);
    const row = message.components[0];
    row.components[0] = newButton;

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  },
};
