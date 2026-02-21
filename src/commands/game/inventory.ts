import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";
import { Player } from "../../classes/Player.js";

export default {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('brings up inventory'),
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const { user, guild } = interaction;

    if (guild == null) 
      return interaction.reply("user not in a server");
    
    let player = await Player.load(user.id, guild.id);
    const embed = player.createInvEmbed()

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
