const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');
// const { Monster } = require(`../../commands/game/fight`);

module.exports = {
  data: {
    name: 'greaterHealPotion',
  },

  async execute(interaction) {
    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const oldEmbed = interaction.message.embeds[0];
    const healedPlayerHealth = storedProfile.maxHealth;

    await Profile.findOneAndUpdate(
      // eslint-disable-next-line no-underscore-dangle
      { _id: storedProfile._id },
      {
        health: healedPlayerHealth,
      }
    );

    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(3, 1, {
      name: interaction.user.username,
      value: `${healedPlayerHealth}/${storedProfile.maxHealth}`,
      inline: true,
    });

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};
