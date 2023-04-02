const Balance = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.fetchBalance = async (userId, guildId) => {
    let storedBalance = await Balance.findOne({
      userId,
      guildId,
    });

    if (!storedBalance) {
      storedBalance = new Balance({
        userId,
        guildId,
      });

      await storedBalance
        .save()
        .then(async (balance) => {
          console.log(
            `New Balance:\n    UserID: ${balance.userId}\n    GuildID: ${balance.guildId}`
          );
        })
        .catch(console.error);

      return storedBalance;
    }
    return storedBalance;
  };
};
