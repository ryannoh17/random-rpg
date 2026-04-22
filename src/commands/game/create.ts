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

    const { id: userID, username } = user;
    const { id: guildID } = guild;

    const result = await Profile.updateOne(
      { userID: userID, guildID: guildID },
      { userID: userID, guildID: guildID, name: username },
      { upsert: true }
    );

    if (result.upsertedId) {
      return interaction.reply({
        content: `${username}'s profile has been created`,
      });
    }

    return interaction.reply({
      content: `${username}'s profile already exists`,
      ephemeral: true,
    });
  },
};
