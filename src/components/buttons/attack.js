const { EmbedBuilder, ButtonBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');
// const { Monster } = require('../../commands/game/fight');

module.exports = {
  data: {
    name: 'attack',
  },

  async execute(interaction, client) {
    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const oldEmbed = interaction.message.embeds[0];

    const { monster } = storedProfile;
    const newMonsterHealth = monster.health - storedProfile.attack;
    const newplayerHealth = storedProfile.health - monster.attack;

    monster.health = newMonsterHealth;

    // --- WHEN PLAYER DIES ---
    if (parseInt(newplayerHealth, 10) <= 0) {
      await Profile.findOneAndUpdate(
        { _id: storedProfile._id },
        {
          maxHealth: 10,
          health: 10,
          attack: 2,
          level: 1,
          exp: 0,
          maxExp: 100,
          monster: null,
          isFighting: false,
          inventory: [],
        }
      );

      const row = interaction.message.components[0];
      const newAttackButton = ButtonBuilder.from(interaction.component).setDisabled(
        true
      );
      row.components[0] = newAttackButton;

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monster.name}`,
          value: `${newMonsterHealth}/${monster.health}`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: interaction.user.username,
          value: `0/${storedProfile.maxHealth}`,
          inline: true,
        })
        .spliceFields(4, 1, {
          name: `\u200B`,
          value: `${interaction.user.username} has been killed`,
        });

      await interaction.update({
        embeds: [newEmbed],
        components: [row],
      });

      // --- WHEN MONSTER DIES ---
    } else if (parseInt(newMonsterHealth, 10) <= 0) {
      const newExp = storedProfile.exp + 30;

      client.addItem(storedProfile.inventory, monster.drops, storedProfile._id);

      await Profile.findOneAndUpdate(
        { _id: storedProfile._id },
        {
          exp: newExp,
          isFighting: false,
        }
      );

      await client.checkExp(interaction.user.id, interaction.guild.id);

      const newButton = ButtonBuilder.from(interaction.component).setDisabled(
        true
      );
      const row = interaction.message.components[0];
      row.components[0] = newButton;

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monster.name}`,
          value: `0/${monster.maxHealth}`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: interaction.user.username,
          value: `${newplayerHealth}/${storedProfile.maxHealth}`,
          inline: true,
        })
        .spliceFields(4, 1, {
          name: `\u200B`,
          value: `${monster.name} has been killed`,
        });

      await interaction.update({
        embeds: [newEmbed],
        components: [row],
      });

      monster.health = monster.maxHealth;

      // --- DEFAULT ---
    } else {
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monster.name}`,
          value: `${newMonsterHealth}/${monster.maxHealth}`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: interaction.user.username,
          value: `${newplayerHealth}/${storedProfile.maxHealth}`,
          inline: true,
        });

      await interaction.update({
        embeds: [newEmbed],
      });
    }

    await Profile.findOneAndUpdate(
      { _id: storedProfile._id },
      {
        monster,
        health: newplayerHealth,
      }
    );
  },
};
