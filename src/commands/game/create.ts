import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creates player profile"),

  async execute(interaction: ChatInputCommandInteraction) {
    const { user, guild } = interaction;

    if (guild == null)
      return interaction.reply("user not in a server");

    const { id: userID, tag } = user;
    const { id: guildID } = guild;

    const result = await Profile.updateOne(
      { userId: userID, tag: tag, guildId: guildID },
      { userId: userID, tag: tag, guildId: guildID },
      { upsert: true }
    );

    if (result.upsertedId) {
      console.log(`New Profile: ${user.tag}`);
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
