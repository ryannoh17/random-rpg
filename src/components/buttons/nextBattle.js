import { ButtonBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: {
    name: "nextBattle",
  },

  async execute(interaction, client) {
    const { message } = interaction;
    const { title } = message.embeds[0];
    const { user, guild } = interaction;
    let monster;

    switch (title) {
      case 'Sunlit Meadows': {
        monster = await client.fromSLM();
        break;
      }
      case "Greenwood": {
        monster = await client.fromGNW();
        break;
      }
      default:
        break;
    }

    const storedProfile = await Profile.findOneAndUpdate(
      { userId: user.id, guildId: guild.id },
      { monster },
    );

    if (storedProfile.monster.name === 'Dummy') {
      monster = storedProfile.monster;
    }

    const monsterEmbed = await client.createFightEmbed(
      monster,
      user.username,
      storedProfile,
      title
    );

    const row = message.components[0];
    const newAttackButton = ButtonBuilder.from(row.components[0]).setDisabled(
      false
    );
    row.components[0] = newAttackButton;

    return interaction.update({
      embeds: [monsterEmbed],
      components: [row],
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
