import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../../classes/Player.js";

export default {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('brings up inventory'),

  async execute(interaction: ChatInputCommandInteraction) {
    const { user, guild } = interaction;

    if (guild == null) 
      return interaction.reply("user not in a server");
    
    let player = await Player.load(user.id, guild.id);
    if (!player) {
      return interaction.reply("create a player first with /create");
    }
    const invEmbed = player.inventory.createInvEmbed();

    return interaction.reply({
      embeds: [invEmbed],
      ephemeral: true,
    });
  },
};
