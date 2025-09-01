import { Profile } from "../../../schemas/profile.js";

export default (client) => {
  client.fightMonster = async (interaction, monster, row, area) => {
    const { user, guild } = interaction;

    const storedProfile = await Profile.findOneAndUpdate(
      { userId: user.id, guildId: guild.id },
      { monster },
      { new: true }
    );

    const monsterEmbed = await client.createFightEmbed(
      storedProfile.monster,
      user.username,
      storedProfile,
      area
    );

    return interaction.reply({
      embeds: [monsterEmbed],
      components: [row],
    });
  };
};
