const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'healPotion',
  },

  async execute(interaction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0];

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const healedPlayerHealth = storedProfile.health + 5 - storedProfile.monster.attack;

    await Profile.findByIdAndUpdate(
      { _id: storedProfile._id },
      {
        health: healedPlayerHealth,
      }
    );

    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(3, 1, {
      name: user.username,
      value: `${healedPlayerHealth}/${storedProfile.maxHealth}`,
      inline: true,
    });

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};
