import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";
import { Player } from "../../classes/Player.js";
// const { Monster } = require(`../../commands/game/fight`);

export default {
  data: {
    name: 'greaterHealPotion',
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0]!;

    let player = await Player.load(user.id, guild!.id);

    player.health = player.maxHealth;

    await player.save();

    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(3, 1, {
      name: user.username,
      value: `${player.health}/${player.maxHealth}`,
      inline: true,
    });

    return interaction.update({
      embeds: [newEmbed],
    });
  },
};
