import {
  REST,
  Routes,
  Client,
} from "discord.js";
import { readdirSync } from "fs";
import type { commandFile } from "../../types.js";

export default (client: Client) => {
  client.commandHandler = async () => {
    const commandFolder = readdirSync(`./src/commands`);
    for (const folder of commandFolder) {
      const commandFiles = readdirSync(`./src/commands/${folder}`).filter(
        (file) => file.endsWith("js")
      );

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command: commandFile = await import(`../../../src/commands/${folder}/${file}`);

        commands.set(command.default.data.name, command);
        commandArray.push(command.default.data.toJSON());
      }
    }

    const clientId = "1079791021560438854";
    // const guildId = '913995256385646603';
    const rest = new REST({ version: "10" }).setToken(
      "MTA3OTc5MTAyMTU2MDQzODg1NA.GUPqjv.0-rWgMvmlMxcYvj9wcclCjKcEZQz1_ArVHO0b0"
    );

    try {
      console.log("starting commands");

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      console.log("commands loaded");
    } catch (error) {
      console.error(error);
    }
  };
};