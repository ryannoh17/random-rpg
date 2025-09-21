import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { connect } from "mongoose";
import { glob } from "glob";
import commandHandler from "./functions/handlers/commandHandler.js";
import eventHandler from "./functions/handlers/eventHandler.js";
import componentHandler from "./functions/handlers/componentHandler.js";
import type { commandFile, componentFile, functionFile } from "./types.js";
import { config } from "dotenv"

declare module "discord.js" {
  interface Client {
    commands: Collection<string, commandFile>;
    buttons: Collection<string, componentFile>;
    cooldowns: Collection<number, any>;
    inventory: Collection<string, any>;
    commandArray: any[];
    commandHandler: () => void;
    eventHandler: () => void;
    componentHandler: () => void;
  }
}

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

commandHandler(client);
eventHandler(client);
componentHandler(client);

client.commands = new Collection();
client.buttons = new Collection();
client.cooldowns = new Collection();
client.inventory = new Collection();
client.commandArray = [];
client.commandHandler();
client.eventHandler();
client.componentHandler();

async function doGlob(): Promise<void> {
  const functionFiles = await glob(`src/functions/handlers/*.js`);

  for (const file of functionFiles) {
    const realPath = ("../").concat(file);
    const func: functionFile = await import(realPath);
    func.default(client);
  }
}
await doGlob();

client.login(process.env.DISCORD_BOT_KEY);

(async (): Promise<void> => {
  await connect(process.env.MONGODB_KEY!).catch(console.error);
})();

// https://discord.com/oauth2/authorize?client_id=1079791021560438854&scope=bot&permissions=8

// uhhhhh

// const fs = require('fs');
// const path = require('path');

// const functionFolders = fs.readdirSync(`./src/functions`);
// for (const folder of functionFolders) {
//   const functionFiles = fs
//     .readdirSync(`./src/functions/${folder}`)
//     .filter((file) => file.endsWith('js'));
//   for (const file of functionFiles) {
//     console.log(`./functions/${folder}/${file}`);
//     require(`./functions/${folder}/${file}`)(client);
//   }
// }