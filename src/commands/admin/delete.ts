import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('delete profile'),

  async execute(interaction: ChatInputCommandInteraction) {
    const { user, guild } = interaction;

    if (user.id !== '449357416287567873')
      return interaction.reply('not an admin can not use');

    if (guild == null) {
      return interaction.reply('user does not exist');
    }

    const result = await Profile.deleteOne({
      userId: user.id,
      guildId: guild.id,
    });

    if (result.deletedCount === 1) {
      return interaction.reply({
        content: `${user.username}'s profile has been deleted`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: 'Player profile does not exists',
      ephemeral: true,
    });
  },
};
