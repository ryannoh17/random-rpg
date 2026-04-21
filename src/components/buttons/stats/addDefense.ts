import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Player } from "../../../classes/Player.js";

export default {
  data: {
    name: 'addDefense',
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0]!;

    let player = await Player.load(user.id, guild!.id);

    player.statPoints -= 1;
    player.defense += 1;

    await player.save();

    const newEmbed = EmbedBuilder.from(oldEmbed)
      .spliceFields(9, 1, {
        name: `defense`,
        value: `${player.defense}`,
        inline: true,
      })
      .spliceFields(6, 1, {
        name: `stat points`,
        value: `${player.statPoints}`,
      });

    if (player.statPoints === 0) {
      return interaction.update({
        embeds: [newEmbed],
        components: [],
      });
    }

    return interaction.update({
      embeds: [newEmbed],
    });
  },
};
