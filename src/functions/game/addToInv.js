/* eslint-disable no-param-reassign */

module.exports = (client) => {
  // eslint-disable-next-line consistent-return
  client.addToInv = async (inventory, addedItemArray, profileId) => {
    const materialItems = [];
    const potionItems = [];
    const equipmentItems = [];
    
    for (let i = 0; i < addedItemArray.length; i++) {
      const selectedItem = addedItemArray[i];
      if (selectedItem.type === 'material') {
        materialItems.push(selectedItem);
      } else if (selectedItem.type === 'potion') {
        potionItems.push(selectedItem);
      } else {
        equipmentItems.push(selectedItem);
      }
    }

    await client.addItem(inventory, 0, materialItems, profileId);
    await client.addItem(inventory, 1, potionItems, profileId);
    await client.addItem(inventory, 2, equipmentItems, profileId);
  };
};
