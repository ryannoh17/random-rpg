import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ChatInputCommandInteraction,
} from "discord.js";
import { Profile } from "../../schemas/profile.js";
import { Monster } from "../../classes/monster.js";
import { itemArray } from "../../items.js";
import { Player } from "../../classes/Player.js";

export default {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Fight!')
    .addStringOption((option) =>
      option
        .setName('area')
        .setDescription('enter selected area')
        .setRequired(true)
        .addChoices(
          // sunlit meadows, greenwood, Phantom Caves
          { name: 'Dummy', value: 'Dummy' },
          { name: 'Sunlit Meadow', value: 'Sunlit Meadow' },
          { name: 'Greenwood', value: 'Greenwood' }
        )
    ),
  // eslint-disable-next-line consistent-return
  async execute(interaction: ChatInputCommandInteraction, client: Client, title: string) {
    const { user, guild } = interaction;

    if (guild == null)
      return interaction.reply("user not in a server");

    let player = await Player.load(user.id, guild.id);
    
    if (player.isFighting) {
      if (!player.monster) {
        return interaction.reply("no monster huhhhh");
      }

      return player.fightMonster(interaction, player.monster);
    }

    const selectedArea = title || (interaction.options.getString('area'));

    // switch (selectedArea) {
    //   case 'Dummy': {
    //     const drops = [itemArray[0]];
    //     const dummy = new Monster('Dummy', 30, 0, drops);

    //     player.monster = dummy;

    //     await client.fightMonster(interaction, dummy, row, selectedArea);
    //     break;
    //   }

    //   case 'Sunlit Meadows': {
    //     const monster = await client.fromSLM();
    //     await client.fightMonster(interaction, monster, row, selectedArea);
    //     break;
    //   }

    //   case 'Greenwood': {
    //     const monster = await client.fromGNW();
    //     await client.fightMonster(interaction, monster, row, selectedArea);
    //     break;
    //   }

    //   default:
    //     break;
    // }

    const spawnedMonster = Monster.spawn(selectedArea!);
    player.fightMonster(interaction, spawnedMonster);
  },
};
