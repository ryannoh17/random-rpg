import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Player } from "../../classes/Player.js";

// THIS DOES NOT WORK PLS MODULARIZE WHAT HAPPENS TO FIGHT EMBED WHEN DIFFERENT THINGS HAPPEN

export default {
  data: {
    name: 'damagePotion',
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild } = interaction;

    let player = await Player.load(user.id, guild!.id);
    const oldEmbed = interaction.message.embeds[0]!;

    const monster = player.monster!;
    monster.health - player.intelligence;
    player.health - monster.attack;

    if (player.health <= 0) {
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(0, 1, {
          name: `${monster.name}`,
          value: `${monster.health}`,
          inline: true,
        })
        .spliceFields(2, 1, {
          name: interaction.user.username,
          value: `0`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: `\u200B`,
          value: `${interaction.user.username} has been killed`,
        });

      player.die();

      return await interaction.update({
        embeds: [newEmbed],
        components: [],
      });
    } else {
      const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(2, 1, {
        name: interaction.user.username,
        value: `${player.health}`,
        inline: true,
      });

      await interaction.update({
        embeds: [newEmbed],
      });
    }
  },
};
