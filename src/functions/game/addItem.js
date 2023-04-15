/* eslint-disable no-param-reassign */
const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line consistent-return
  client.addItem = async (inventory, invIndex, addedItem, profileId) => {
    // console.time('newItem');
    if (addedItem.length === 0) return;

    const invSeg = inventory[invIndex];

    if (invSeg.length === 0) {
      inventory[invIndex] = addedItem;

      await Profile.findByIdAndUpdate(
        { _id: profileId },
        {
          inventory,
        }
      );
      // console.timeEnd('newItem');
      return;
    }

    console.time('addItem');
    const newInv = invSeg.map((items) => items.id);

    for (let i = 0; i < addedItem.length; i++) {
      const selectedItem = addedItem[i];
      if (newInv.includes(selectedItem.id)) {
        const index = newInv.indexOf(selectedItem.id);

        inventory[invIndex][index].quantity += selectedItem.quantity;
      } else {
        inventory[invIndex] = inventory[invIndex].concat(selectedItem);
      }
    }

    await Profile.findByIdAndUpdate(
      { _id: profileId },
      {
        inventory,
      }
    );
    console.timeEnd('addItem');
  };
};
