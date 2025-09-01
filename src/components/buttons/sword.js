import { EmbedBuilder, ButtonBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";

export default {
  data: {
    name: 'sword',
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

    monster.health -= storedProfile.strength;
    playerHealth -= monster.attack;

    const {
      maxHealth: monsterMaxHealth,
      name: monsterName,
      health: monsterHealth,
    } = monster;

    const row = message.components[0];
    const newSwordButton = ButtonBuilder.from(button).setDisabled(true);
    const swordButton = ButtonBuilder.from(button).setDisabled(false);

    // --- WHEN MONSTER DIES ---

    if (monsterHealth <= 0) {
      const newExp = storedProfile.exp + 30;
      monster.health = monsterMaxHealth;

      await client.addToInv(storedProfile.inventory, monster.drops, dbId);
      // maybe change this later since updating db twice is bad
      await client.checkExp(user.id, guild.id);

      row.components[0] = newSwordButton;

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(1, 1, {
          name: `${monsterName}`,
          value: `0/${monsterMaxHealth}`,
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

      await Profile.findByIdAndUpdate(
        { _id: dbId },
        {
          exp: newExp,
          isFighting: false,
          monster,
        }
      );

      // --- WHEN PLAYER DIES ---

    } else if (playerHealth <= 0) {
      const newNextButton = ButtonBuilder.from(row.components[2]).setDisabled(
        true
      );
      row.components[2] = newNextButton;
      row.components[0] = newSwordButton;

      const playerHit = EmbedBuilder.from(oldEmbed).spliceFields(1, 1, {
        name: `${monsterName}`,
        value: `${monsterHealth}/${monsterMaxHealth}`,
        inline: true,
      });

      const monsterHit = EmbedBuilder.from(playerHit)
        .spliceFields(3, 1, {
          name: user.username,
          value: `0/${playerMaxHealth}`,
          inline: true,
        })
        .spliceFields(4, 1, {
          name: `\u200B`,
          value: `${user.username} has been killed`,
        });

      await interaction
        .update({
          embeds: [playerHit],
          components: [row],
        })
        .then(() => {
          setTimeout(() => {
            interaction.editReply({
              embeds: [monsterHit],
            });
          }, 750);
        });

      await Profile.findByIdAndUpdate(
        { _id: dbId },
        {
          maxHealth: 100,
          health: 100,
          maxMana: 0,
          mana: 0,
          strength: 10,
          stamina: 5,
          defense: 0,
          wisdom: 0,
          intelligence: 0,
          agility: 0,
          statPoints: 0,
          level: 1,
          exp: 0,
          maxExp: 100,
          monster: null,
          isFighting: false,
          inventory: [[], [], []],
          coins: 0
        }
      );

      // --- DEFAULT ---

    } else {
      const playerHit = EmbedBuilder.from(oldEmbed).spliceFields(1, 1, {
        name: `${monsterName}`,
        value: `${monsterHealth}/${monsterMaxHealth}`,
        inline: true,
      });

      const monsterHit = EmbedBuilder.from(playerHit).spliceFields(3, 1, {
        name: user.username,
        value: `${playerHealth}/${playerMaxHealth}`,
        inline: true,
      });

      row.components[0] = newSwordButton;

      await interaction
        .update({
          embeds: [playerHit],
          components: [row],
        })
        .then(() => {
          setTimeout(() => {
            row.components[0] = swordButton;

            interaction.editReply({
              embeds: [monsterHit],
              components: [row],
            });
          }, 750);
        });

      await Profile.findByIdAndUpdate(
        { _id: dbId },
        {
          isFighting: true,
          monster,
          health: playerHealth,
        }
      );
    }
  },
};
