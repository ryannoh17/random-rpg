const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.createFightEmbed = async (monster, playerName, player, area) => {
    const embed = new EmbedBuilder()
      .setTitle(`${area}`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      // .setImage('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Buffs',
          value: '\u200B',
        },
        {
          name: `${monster.name}`,
          value: `${monster.health}/${monster.maxHealth}`,
          inline: true,
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: true,
        },
        {
          name: `${playerName}`,
          value: `${player.health}/${player.maxHealth}`,
          inline: true,
        },

        {
          name: `\u200B`,
          value: `\u200B`,
        },
      ]);
    // .setFooter({ text: 'nothing to see here', iconURL: 'https://i.stack.imgur.com/Fzh0w.png'});

    return embed;
  };
};
