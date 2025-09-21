import { SlashCommandBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creates player profile"),

  async execute(interaction) {
    const { user, guild } = interaction;

    if (guild == null) {
      return interaction.reply({
        content: "can't use bot in dms",
      });
    }

    const result = await Profile.updateOne(
      { userId: user.id, tag: user.tag, guildId: guild.id },
      { userId: user.id, tag: user.tag, guildId: guild.id },
      { upsert: true }
    );

    if (result.upsertedId) {
      console.log(`New Profile: ${result.tag}`);
      return interaction.reply({
        content: `${user.username}'s profile has been created`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: "Player profile already exists",
      ephemeral: true,
    });
  },
};
