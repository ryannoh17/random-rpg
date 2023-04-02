const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.createProfile = async (userId, tag, guildId) => {
    const storedProfile = new Profile({
      userId,
      tag,
      guildId,
    });

    await storedProfile
      .save()
      .then(async (profile) => {
        console.log(`New Profile: ${profile.tag}`);
      })
      .catch(console.error);
  };
};
