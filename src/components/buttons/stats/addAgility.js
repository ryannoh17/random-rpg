import { EmbedBuilder } from "discord.js";
import { Profile } from "../../../schemas/profile.js";

export default {
  data: {
    name: 'addAgility',
  },

  async execute(interaction) {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0];

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const { _id, statPoints, agility } = storedProfile;

    await Profile.findByIdAndUpdate(
      { _id },
      {
        statPoints: statPoints - 1,
        agility: agility + 1,
      }
    );

    const newEmbed = EmbedBuilder.from(oldEmbed)
      .spliceFields(12, 1, {
        name: `agility`,
        value: `${agility + 1}`,
        inline: true,
      })
      .spliceFields(6, 1, {
        name: `stat points`,
        value: `${statPoints - 1}`,
      });

    if (statPoints - 1 === 0) {
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
