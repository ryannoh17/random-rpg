import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('brings up inventory'),
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const { user, guild } = interaction;

    if (guild == null) 
      return interaction.reply("user not in a server");
    
    const { id: userID, username } = user;

    const storedProfile = await Profile.findOne({
      userId: userID,
      guildId: guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${username}'s profile does not exist`,
        ephemeral: true,
      });

    const { inventory, coins } = storedProfile;

    const invSections = await client.giveInvSections(inventory);

    const embed = await client.createInvEmbed(inventory, invSections, coins);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
