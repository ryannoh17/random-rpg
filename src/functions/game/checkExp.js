const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.checkExp = async (userId, guildId) => {
    const storedProfile = await Profile.findOne({
      userId,
      guildId,
    });

    const { exp, maxExp, strength, maxHealth, level, statPoints } = storedProfile;

    const leftover = exp - maxExp;

    if (leftover >= 0) {
      const newLevel = level + 1;

      await Profile.findByIdAndUpdate(
        { _id: storedProfile._id },
        {
          statPoints: statPoints + 1,
          level: newLevel,
          exp: leftover,
          maxExp: newLevel * 100,
          strength: strength + 1,
          maxHealth: maxHealth + 2,
        }
      );
    }
  };
};
