import { Client } from "discord.js";
import { glob } from "glob";
import { readdirSync } from "fs";
import type { componentFile } from "../../types.js";

export default (client: Client) => {
  client.componentHandler = async () => {
    const buttonFiles = await glob(`src/components/buttons/**/*.js`);

    const componentFolders = readdirSync(`./src/components`);
    for (const folder of componentFolders) {
      const { buttons } = client;

      switch (folder) {
        case 'buttons': {
          for (const file of buttonFiles) {
            let path = '../../../';
            path = path.concat(file);
            const button: componentFile = await import(path);

            buttons.set(button.default.data.name, button);
          }
          break;
        }
      }
    }
  };
};