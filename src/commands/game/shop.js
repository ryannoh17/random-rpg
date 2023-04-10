const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const Profile = require('../../schemas/profile');

const shopList = ['healing potion', 'greater healing potion'];

module.exports = {
  shopList,
  data: new SlashCommandBuilder().setName('shop').setDescription('opens shop'),
  async execute(interaction) {
    const { user, guild } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${user.username}'s profile does not exist, use /create to make profile`,
        ephemeral: true,
      });

    const buyButton = new ButtonBuilder()
      .setCustomId('buy')
      .setLabel('buy')
      .setStyle(ButtonStyle.Primary);
    const sellButton = new ButtonBuilder()
      .setCustomId('sell')
      .setLabel('sell')
      .setStyle(ButtonStyle.Primary);
    const shopItems = shopList.join('\n');
    const row = new ActionRowBuilder().addComponents(buyButton, sellButton);

    const embed = new EmbedBuilder()
      .setTitle(`Shop`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Items',
          value: `${shopItems}`,
        },
      ]);

    return interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
