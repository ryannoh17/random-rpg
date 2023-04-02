const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.checkExp = async (userId, guildId) => {
    const storedProfile = await client.getProfile(userId, guildId);

    const storedBalance = await Profile.findOne({
      userId,
      guildId,
    });

    const leftover = storedBalance.exp - storedBalance.maxExp;

    if (leftover >= 0) {
      const newLevel = storedBalance.level + 1;

      await Profile.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { _id: storedProfile._id },
        {
          level: newLevel,
          exp: leftover,
          maxExp: newLevel * 100,
          attack: storedBalance.attack + 1,
          maxHealth: storedBalance.maxHealth + 2,
        }
      );
    }
  };
};
