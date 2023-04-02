/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.commandHandler = async () => {
    const commandFolder = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolder) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith('js'));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);

        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }

    const clientId = '1079791021560438854';
    // const guildId = '913995256385646603';
    const rest = new REST({ version: '10' }).setToken(
      'MTA3OTc5MTAyMTU2MDQzODg1NA.GUPqjv.0-rWgMvmlMxcYvj9wcclCjKcEZQz1_ArVHO0b0'
    );

    try {
      console.log('starting commands');

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      console.log('commands loaded');
    } catch (error) {
      console.error(error);
    }
  };
};
