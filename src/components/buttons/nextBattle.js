// const { ButtonBuilder } = require('discord.js');
// const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'nextBattle',
  },

  async execute(interaction, client) {
    const { message } = interaction;
    const { commands } = client;
    const { title } = message.embeds[0];
    const command = await commands.find(cmd => cmd.data.name === 'fight');
    command.execute(interaction, client, title);
    // const { user, guild, message } = interaction;

    // const storedProfile = await Profile.findOne({
    //   userId: user.id,
    //   guildId: guild.id,
    // });

    // const embed = await client.createFightEmbed(
    //   storedProfile.monster,
    //   user.username,
    //   storedProfile
    // );

    // const newButton = ButtonBuilder.from(
    //   message.components[0].components[0]
    // ).setDisabled(false);
    // const row = message.components[0];
    // row.components[0] = newButton;

    // await interaction.update({
    //   embeds: [embed],
    //   components: [row],
    // });
  },
};
