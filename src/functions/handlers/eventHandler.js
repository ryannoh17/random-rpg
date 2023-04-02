/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */

const fs = require('fs');
const { connection } = require('mongoose');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.eventHandler = async () => {
    const eventFolders = fs.readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith('js'));

      switch (folder) {
        case 'client':
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);

            if (event.once)
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        case 'mongo':
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);

            if (event.once)
              connection.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              connection.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        default:
          break;
      }
    }
  };
};
