/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { connect } = require('mongoose');
const { glob } = require('glob');
// const fs = require('fs');
// const path = require('path');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  Partials: [User, Message, GuildMember, ThreadMember],
});

require('./functions/handlers/commandHandler')(client);
require('./functions/handlers/componentHandler')(client);
require('./functions/handlers/eventHandler')(client);

client.commands = new Collection();
client.buttons = new Collection();
client.cooldowns = new Collection();
client.inventory = new Collection();
client.commandArray = [];

async function doGlob() {
  const functionFiles = await glob(`src/functions/**/*.js`);

  for (const file of functionFiles) {
    const realPath = file.replace('src', '.');
    require(realPath)(client);
  }
}

doGlob();

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

client.commandHandler();
client.eventHandler();
client.componentHandler();
client.login(
  'MTA3OTc5MTAyMTU2MDQzODg1NA.GUPqjv.0-rWgMvmlMxcYvj9wcclCjKcEZQz1_ArVHO0b0'
);

(async () => {
  await connect(
    'mongodb+srv://ryannoh17:7077527@cluster0.ujqzyoh.mongodb.net/?retryWrites=true&w=majority'
  ).catch(console.error);
})();

// https://discord.com/oauth2/authorize?client_id=1079791021560438854&scope=bot&permissions=8
// mongodb+srv://ryannoh17:7077527@cluster0.ujqzyoh.mongodb.net/?retryWrites=true&w=majority

// random events pop up through buttons by chance
// make skills, check skills, give skiils
// auto battle / afk battling

// create functions for monster stats (rng)
// make a fight command (maybe using menu/buttons)

// switch if statements to switch after implementing multiple interaction types
