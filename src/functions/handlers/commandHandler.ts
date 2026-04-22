import { REST, Routes, Client } from "discord.js";
import { readdirSync } from "fs";
import type { commandFile } from "../../types.js";
import * as dotenv from "dotenv";
dotenv.config();

export default (client: Client) => {
  client.commandHandler = async () => {
    const commandFolder = readdirSync(`./dist/commands`);
    for (const folder of commandFolder) {
      const commandFiles = readdirSync(`./dist/commands/${folder}`).filter(
        (file) => file.endsWith("js")
      );

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command: commandFile = await import(`../../../dist/commands/${folder}/${file}`);

        commands.set(command.default.data.name, command);
        commandArray.push(command.default.data.toJSON());
      }
    }

    const clientID = "1079791021560438854";
    // const guildID = '913995256385646603';
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_KEY!);

    try {
      console.log("starting commands");

      await rest.put(Routes.applicationCommands(clientID), {
        body: client.commandArray,
      });

      console.log("commands loaded");
    } catch (error) {
      console.error(error);
    }
  };
};