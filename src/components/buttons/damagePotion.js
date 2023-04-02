const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'damagePotion',
  },

  async execute(interaction, client) {
    const storedProfile = await client.getProfile(
      interaction.user.id,
      interaction.guild.id
    );
    const oldEmbed = interaction.message.embeds[0];

    const monster = oldEmbed.fields[1].name;
    const newMonsterHealth = oldEmbed.fields[1].value - storedProfile.attack;
    const playerHealth = parseInt(oldEmbed.fields[2].value, 10) - 2;

    if (parseInt(playerHealth, 10) <= 0) {
      await Profile.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { _id: storedProfile._id },
        {
          attack: 2,
          health: 10,
          level: 1,
          exp: 0,
          maxExp: 100,
        }
      );

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(0, 1, {
          name: `${monster}`,
          value: `${newMonsterHealth}`,
          inline: true,
        })
        .spliceFields(2, 1, {
          name: interaction.user.username,
          value: `0`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: `\u200B`,
          value: `${interaction.user.username} has been killed`,
        });

      await interaction.update({
        embeds: [newEmbed],
        components: [],
      });
    } else {
      const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(2, 1, {
        name: interaction.user.username,
        value: `${playerHealth}`,
        inline: true,
      });

      await interaction.update({
        embeds: [newEmbed],
      });
    }
  },
};
