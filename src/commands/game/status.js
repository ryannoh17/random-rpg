const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Brings Up Status Window')
    .addUserOption((option) =>
      option.setName('target').setDescription('searches selected user ')
    ),

  async execute(interaction) {
    const selectedUser =
      interaction.options.getUser('target') || interaction.user;

    const storedProfile = await Profile.findOne({
      userId: selectedUser.id,
      guildId: interaction.guild.id
    });

    if (
      selectedUser !== interaction.user &&
      interaction.user.id !== '449357416287567873'
    )
      return interaction.reply({
        content: `Activation Failed, Player requires **God's Eyes**`,
        ephemeral: true,
      });

    if (!storedProfile)
      return interaction.reply({
        content: `${selectedUser.username}'s profile does not exist`,
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setColor(`#00FFFF`)
      .setTitle(`**${selectedUser.username}'s Status Window**`)
      .setTimestamp()
      .addFields([
        {
          name: `health`,
          value: `${storedProfile.health}`,
          inline: true,
        },
        {
          name: `attack`,
          value: `${storedProfile.attack}`,
          inline: true,
        },
        {
          name: `level ${storedProfile.level}`,
          value: `${storedProfile.exp}/${storedProfile.maxExp}`,
        },
      ])
      .setFooter({
        text: selectedUser.tag,
        iconURL: selectedUser.displayAvatarURL(),
      });

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
