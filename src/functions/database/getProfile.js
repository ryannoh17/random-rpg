const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.getProfile = async (userId, guildId, interaction) => {
    const storedProfile = await Profile.findOne({
      userId,
      guildId,
    });

    if (!storedProfile)
      await interaction.reply({
        content: 'No profile exists.',
        ephemeral: true,
      });

    return storedProfile;
  };
};
