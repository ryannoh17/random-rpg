const { ButtonBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'nextBattle',
  },

  async execute(interaction, client) {
    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const embed = await client.createFightEmbed(
      storedProfile.monster,
      interaction.user.username,
      storedProfile
    );

    const newButton = ButtonBuilder.from(interaction.message.components[0].components[0]).setDisabled(
      false
    );
    const row = interaction.message.components[0];
    row.components[0] = newButton;

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  },
};
