/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */

const fs = require('fs');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.componentHandler = async () => {
    const componentFolders = fs.readdirSync(`./src/components`);
    for (const folder of componentFolders) {
      const componentFiles = fs
        .readdirSync(`./src/components/${folder}`)
        .filter((file) => file.endsWith('.js'));

      const { buttons } = client;

      switch (folder) {
        case 'buttons':
          for (const file of componentFiles) {
            const button = require(`../../components/${folder}/${file}`);

            buttons.set(button.data.name, button);
          }
          break;
      }
    }
  };
};
