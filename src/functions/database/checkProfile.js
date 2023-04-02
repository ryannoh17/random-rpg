const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.checkProfile = async (userId, guildId) => {
    const storedProfile = await Profile.findOne({
      userId,
      guildId,
    });

    if (!storedProfile) return false;
    return true;
  };
};
