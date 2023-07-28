/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
const { glob } = require('glob');
const fs = require('fs');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.componentHandler = async () => {
    const buttonFiles = await glob(`src/components/buttons/**/*.js`);

    const componentFolders = fs.readdirSync(`./src/components`);
    for (const folder of componentFolders) {
      const { buttons } = client;

      switch (folder) {
        case 'buttons': {
          for (const file of buttonFiles) {
            let path = '..\\'
            path = path.concat(file);
            const realPath = path.replace('src', '..');
            const button = require(realPath);

            buttons.set(button.data.name, button);
          }
          break;
        }
      }
    }
  };
};
