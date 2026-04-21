import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Player } from "../../../classes/Player.js";

export default {
  data: {
    name: 'addIntelligence',
  },

  // 11

  async execute(interaction: ButtonInteraction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0]!;

    let player = await Player.load(user.id, guild!.id);

    player.statPoints -= 1;
    player.agility += 1;

    await player.save();

    const newEmbed = EmbedBuilder.from(oldEmbed)
      .spliceFields(11, 1, {
        name: `intelligence`,
        value: `${player.intelligence}`,
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
