const { EmbedBuilder } = require('discord.js');
const Profile = require('../../../schemas/profile');

module.exports = {
  data: {
    name: 'addIntelligence',
  },

  async execute(interaction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0];

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const { _id, statPoints, intelligence } = storedProfile;

    await Profile.findByIdAndUpdate(
      { _id },
      {
        statPoints: statPoints - 1,
        intelligence: intelligence + 1,
      }
    );

    const newEmbed = EmbedBuilder.from(oldEmbed)
      .spliceFields(11, 1, {
        name: `intelligence`,
        value: `${intelligence + 1}`,
        inline: true,
      })
      .spliceFields(6, 1, {
        name: `stat points`,
        value: `${statPoints - 1}`,
      });

    if (statPoints - 1 === 0) {
      return interaction.update({
        embeds: [newEmbed],
        components: [],
      });
    }

    return interaction.update({
      embeds: [newEmbed],
    });
  },
};
