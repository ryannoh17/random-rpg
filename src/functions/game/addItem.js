/* eslint-disable no-param-reassign */
const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line consistent-return
  client.addItem = async (inventory, addedItem, profileId) => {
    if (inventory.length === 0) {
      inventory = addedItem;

      await Profile.findByIdAndUpdate(
        { _id: profileId },
        {
          inventory,
        }
      );

      return;
    }

    const newInv = inventory.map((items) => items.id);

    for (let i = 0; i < addedItem.length; i++) {
      if (newInv.includes(addedItem[i].id)) {
        const index = newInv.indexOf(addedItem[i].id);

        inventory[index].quantity += addedItem[i].quantity;
      } else {
        inventory = inventory.concat(addedItem[i]);
      }
    }

    await Profile.findByIdAndUpdate(
      { _id: profileId },
      {
        inventory,
      }
    );
  };
};
