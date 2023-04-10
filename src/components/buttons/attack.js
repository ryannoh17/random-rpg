const { EmbedBuilder, ButtonBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'attack',
  },

  async execute(interaction, client) {
    const { user, guild, message, component: button } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const oldEmbed = message.embeds[0];

    const { monster, _id: dbId, maxHealth: playerMaxHealth } = storedProfile;
    let { health: playerHealth } = storedProfile;

    monster.health -= storedProfile.attack;
    playerHealth -= monster.attack;

    const {
      maxHealth: monsterMaxHealth,
      name: monsterName,
      health: monsterHealth,
    } = monster;

    // --- WHEN PLAYER DIES ---
    if (playerHealth <= 0) {
      await Profile.findByIdAndUpdate(
        { _id: dbId },
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

      const newAttackButton = ButtonBuilder.from(button).setDisabled(true);
      const row = message.components[0];
      row.components[0] = newAttackButton;

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monsterName}`,
          value: `${monsterHealth}/${monsterMaxHealth}`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: user.username,
          value: `0/${playerMaxHealth}`,
          inline: true,
        })
        .spliceFields(4, 1, {
          name: `\u200B`,
          value: `${user.username} has been killed`,
        });

      await interaction.update({
        embeds: [newEmbed],
        components: [row],
      });

      // --- WHEN MONSTER DIES ---
    } else if (monsterHealth <= 0) {
      const newExp = storedProfile.exp + 30;

      client.addItem(storedProfile.inventory, monster.drops, dbId);

      await Profile.findByIdAndUpdate(
        { _id: dbId },
        {
          exp: newExp,
          isFighting: false,
        }
      );

      await client.checkExp(user.id, guild.id);

      const newButton = ButtonBuilder.from(button).setDisabled(true);
      const row = message.components[0];
      row.components[0] = newButton;

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monsterName}`,
          value: `0/${monsterMaxHealth}`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: user.username,
          value: `${playerHealth}/${playerMaxHealth}`,
          inline: true,
        })
        .spliceFields(4, 1, {
          name: `\u200B`,
          value: `${monsterName} has been killed`,
        });

      await interaction.update({
        embeds: [newEmbed],
        components: [row],
      });

      monster.health = monsterMaxHealth;

      // --- DEFAULT ---
    } else {
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monsterName}`,
          value: `${monsterHealth}/${monsterMaxHealth}`,
          inline: true,
        })
        .spliceFields(3, 1, {
          name: user.username,
          value: `${playerHealth}/${playerMaxHealth}`,
          inline: true,
        });

      await interaction.update({
        embeds: [newEmbed],
      });
    }

    await Profile.findByIdAndUpdate(
      { _id: dbId },
      {
        monster,
        health: playerHealth,
      }
    );
  },
};
