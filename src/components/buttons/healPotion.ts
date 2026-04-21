import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Player } from "../../classes/Player.js";

export default {
  data: {
    name: 'healPotion',
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0]!;

    let player = await Player.load(user.id, guild!.id);
    let monster = player.monster!;

    player.health += 5 - monster.attack;

    await player.save();
    
    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(3, 1, {
      name: user.username,
      value: `${player.health}/${player.maxHealth}`,
      inline: true,
    });

    return  interaction.update({
      embeds: [newEmbed],
    });
  },
};
