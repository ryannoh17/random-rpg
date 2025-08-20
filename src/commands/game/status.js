const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Brings Up Status Window')
    .addUserOption((option) =>
      option.setName('target').setDescription('searches selected user ')
    ),

  async execute(interaction) {
    const { user, guild } = interaction;
    const selectedUser = interaction.options.getUser('target') || user;

    if (selectedUser !== user && user.id !== '449357416287567873')
      return interaction.reply({
        content: `Activation Failed, Player requires **God's Eyes**`,
        ephemeral: true,
      });

    const storedProfile = await Profile.findOne({
      userId: selectedUser.id,
      guildId: guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${selectedUser.username}'s profile does not exist`,
        ephemeral: true,
      });

    const { maxHealth, health, maxMana, mana, exp, maxExp } = storedProfile;

    let healthCounter = Math.floor((health / maxHealth) * 20);
    let expCounter = Math.floor((exp / maxExp) * 20);
    let manaCounter;

    if (maxMana === 0) {
      manaCounter = 0;
    } else {
      manaCounter = Math.floor((mana / maxMana) * 50);
    }

    let healthBar = '';
    let manaBar = '';
    let expBar = '';

    for (let i = 0; i < 20; i++) {
      if (healthCounter !== 0) {
        healthBar = healthBar.concat('🟩');
        healthCounter--;
      } else {
        healthBar = healthBar.concat('🟥');
      }

      if (manaCounter !== 0) {
        manaBar = manaBar.concat('🟦');
        manaCounter--;
      } else {
        manaBar = manaBar.concat('⬛');
      }

      if (expCounter !== 0) {
        expBar = expBar.concat('🟨');
        expCounter--;
      } else {
        expBar = expBar.concat('⬜');
      }
    }

    const addStrengthButton = new ButtonBuilder()
      .setCustomId('addStrength')
      .setLabel('strength')
      .setStyle(ButtonStyle.Primary);
    const addStaminaButton = new ButtonBuilder()
      .setCustomId('addStamina')
      .setLabel('stamina')
      .setStyle(ButtonStyle.Primary);
    const addDefenseButton = new ButtonBuilder()
      .setCustomId('addDefense')
      .setLabel('defense')
      .setStyle(ButtonStyle.Primary);
    const addWisdomButton = new ButtonBuilder()
      .setCustomId('addWisdom')
      .setLabel('wisdom')
      .setStyle(ButtonStyle.Primary);
    const addIntelligenceButton = new ButtonBuilder()
      .setCustomId('addIntelligence')
      .setLabel('intelligence')
      .setStyle(ButtonStyle.Primary);
    const addAgilityButton = new ButtonBuilder()
      .setCustomId('addAgility')
      .setLabel('agility')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(
      addStrengthButton,
      addStaminaButton,
      addDefenseButton
    );

    const row2 = new ActionRowBuilder().addComponents(
      addWisdomButton,
      addIntelligenceButton,
      addAgilityButton
    );

    const embed = new EmbedBuilder()
      .setColor(`#00FFFF`)
      .setTitle(`**${selectedUser.username}'s Status Window**`)
      .setTimestamp()
      .addFields([
        {
          name: `health`,
          value: `${health}/${maxHealth}`,
        },
        {
          name: `${healthBar}`,
          value: `\u200B`,
        },
        {
          name: `mana`,
          value: `${mana}/${maxMana}`,
        },
        {
          name: `${manaBar}`,
          value: `\u200B`,
        },
        {
          name: `level ${storedProfile.level}`,
          value: `${storedProfile.exp}/${storedProfile.maxExp}`,
        },
        {
          name: ` ${expBar}`,
          value: `\u200B`,
        },
        {
          name: `stat points`,
          value: `${storedProfile.statPoints}`,
        },
        {
          name: `strength`,
          value: `${storedProfile.strength}`,
          inline: true,
        },
        {
          name: `stamina`,
          value: `${storedProfile.stamina}`,
          inline: true,
        },
        {
          name: `defense`,
          value: `${storedProfile.defense}`,
          inline: true,
        },
        {
          name: `wisdom`,
          value: `${storedProfile.wisdom}`,
          inline: true,
        },
        {
          name: `intelligence`,
          value: `${storedProfile.intelligence}`,
          inline: true,
        },
        {
          name: `agility`,
          value: `${storedProfile.agility}`,
          inline: true,
        },
      ])
      .setFooter({
        text: selectedUser.tag,
        iconURL: selectedUser.displayAvatarURL(),
      });

    if (storedProfile.statPoints === 0) {
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    
    return interaction.reply({
      embeds: [embed],
      components: [row, row2],
      ephemeral: true,
    });
  },
};
