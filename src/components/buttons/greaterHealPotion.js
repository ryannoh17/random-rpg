import { EmbedBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";
// const { Monster } = require(`../../commands/game/fight`);

export default {
  data: {
    name: 'greaterHealPotion',
  },

  async execute(interaction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0];

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const { maxHealth } = storedProfile;

    await Profile.findOneAndUpdate(
      { _id: storedProfile._id },
      {
        health: maxHealth,
      }
    );

    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(3, 1, {
      name: user.username,
      value: `${maxHealth}/${maxHealth}`,
      inline: true,
    });

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};
