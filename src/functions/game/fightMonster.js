const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fightMonster = async (interaction, monster, row) => {
    const { user, guild } = interaction;

    const storedProfile = await Profile.findOneAndUpdate(
      { userId: user.id, guildId: guild.id },
      { monster },
      { new: true }
    );

    const monsterEmbed = await client.createFightEmbed(
      storedProfile.monster,
      user.username,
      storedProfile
    );

    return interaction.reply({
      embeds: [monsterEmbed],
      components: [row],
    });
  };
};
