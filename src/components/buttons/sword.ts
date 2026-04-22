import { EmbedBuilder, ButtonBuilder, ButtonInteraction, MessageComponentInteraction, type MessageActionRowComponent, ButtonComponent, ActionRowBuilder } from "discord.js";
import { Profile } from "../../schemas/profile.js";
import { Player } from "../../classes/Player.js";

export default {
  data: {
    name: 'sword',
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild, message, component: button } = interaction;

    let player = (await Player.load(user.id, guild!.id))!;

    const oldEmbed = message.embeds[0]!;

    const { maxHealth: playerMaxHealth } = player;
    let { monster } = player;

    if (!monster) throw new Error(`monster does not exist (how?)`);

    monster.health -= player.strength;
    player.health -= monster.attack;
    const { health: playerHealth } = player;

    const {
      maxHealth: monsterMaxHealth,
      name: monsterName,
      health: monsterHealth,
    } = monster;

    const row = message.components[0]!;
    const offSwordButton = ButtonBuilder.from(button).setDisabled(true);
    const onSwordButton = ButtonBuilder.from(button).setDisabled(false);
    let actionRowBuild = ActionRowBuilder.from(row);

    // --- WHEN MONSTER DIES ---

    if (monsterHealth <= 0) {
      player.addExp(30);
      player.inventory.addToInventory(monster.drops);
      player.isFighting = false;
      monster = null;

      await player.save();

      actionRowBuild.components[0] = offSwordButton;
      const newRow = new ActionRowBuilder<ButtonBuilder>(actionRowBuild);

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

      return interaction.update({
        embeds: [newEmbed],
        components: [newRow],
      });

      // --- WHEN PLAYER DIES ---

    } else if (playerHealth <= 0) {
      player.die();
      await player.save();

      const newNextButton = ButtonBuilder.from(row.components[2] as ButtonComponent).setDisabled(true);
      actionRowBuild.components[0] = offSwordButton;
      actionRowBuild.components[2] = newNextButton;
      const newRow = new ActionRowBuilder<ButtonBuilder>(actionRowBuild);

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

      return interaction
        .update({
          embeds: [playerHit],
          components: [newRow],
        })
        .then(() => {
          setTimeout(() => {
            interaction.editReply({
              embeds: [monsterHit],
            });
          }, 750);
        });

      // --- DEFAULT ---

    } else {
      player.isFighting = true;
      await player.save();

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

      actionRowBuild.components[0] = offSwordButton;
      let newRow = new ActionRowBuilder<ButtonBuilder>(actionRowBuild);

      return interaction
        .update({
          embeds: [playerHit],
          components: [newRow],
        })
        .then(() => {
          setTimeout(() => {
            actionRowBuild.components[0] = onSwordButton;
            newRow = new ActionRowBuilder<ButtonBuilder>(actionRowBuild);

            interaction.editReply({
              embeds: [monsterHit],
              components: [newRow],
            });
          }, 750);
        });

    }
  },
};
