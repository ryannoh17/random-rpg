import { Client } from "discord.js";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import type { eventFile } from "../../types.js";
const { connection } = mongoose;

export default (client: Client) => {
  client.eventHandler = async () => {
    const eventFolders = readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith('js'));

      switch (folder) {
        case 'client':
          for (const file of eventFiles) {
            const event: eventFile = await import(`../../../src/events/${folder}/${file}`);

            if (event.default.once)
              client.once(event.default.name, (...args) =>
                event.default.execute(...args, client)
              );
            else
              client.on(event.default.name, (...args) =>
                event.default.execute(...args, client)
              );
          }
          break;

        case 'mongo':
          for (const file of eventFiles) {
            const event: eventFile = await import(`../../../src/events/${folder}/${file}`);

            if (event.default.once)
              connection.once(event.default.name, (...args) =>
                event.default.execute(...args, client)
              );
            else
              connection.on(event.default.name, (...args) =>
                event.default.execute(...args, client)
              );
          }
          break;

        default:
          break;
      }
    }
  };
};