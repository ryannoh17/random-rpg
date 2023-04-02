const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Creates player profile'),

  async execute(interaction) {
    const { user } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    if (!storedProfile) {
      const newProfile = new Profile({
        userId: user.id,
        tag: user.tag,
        guildId: interaction.guild.id,
      });

      await newProfile
        .save()
        .then(async (profile) => {
          console.log(`New Profile: ${profile.tag}`);
        })
        .catch(console.error);
        
      return interaction.reply({
        content: `${user.username}'s profile has been created`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: 'Player profile already exists',
    });
  },
};
