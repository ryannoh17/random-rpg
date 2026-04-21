import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction } from "discord.js";
import { Monster } from "../../classes/monster.js";
import { Player } from "../../classes/Player.js";

export default {
  data: {
    name: "nextBattle",
  },

  async execute(interaction: ButtonInteraction) {
    const { message } = interaction;
    const { title } = message.embeds[0]!;
    const { user, guild } = interaction;

    if (!title) throw new Error(`Theres no title to grab to spawn a new monster`);
    
    const monster = Monster.spawn(title);

    let player = await Player.load(user.id, guild!.id);
    player.monster = monster;

    const monsterEmbed = player.createFightEmbed();

    const row = message.components[0]!;
    const newAttackButton = ButtonBuilder.from(
      row.components[0]! as ButtonComponent
    ).setDisabled(false);
    let actionRowBuild = ActionRowBuilder.from(row);
    actionRowBuild.components[0] = newAttackButton;

    const newRow = new ActionRowBuilder<ButtonBuilder>(actionRowBuild);

    return interaction.update({
      embeds: [monsterEmbed],
      components: [newRow],
    });
    
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
