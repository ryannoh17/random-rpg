/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const Profile = require('../../schemas/profile');

module.exports = (client) => {
  // eslint-disable-next-line consistent-return
  client.removeItem = async (inventory, addedItem, profileId) => {
    const newInv = inventory.map((items) => items.id);
    const index = newInv.indexOf(addedItem.id);
    
    console.log(inventory[index].quantity, addedItem.quantity);
    inventory[index].quantity -= addedItem.quantity;

    if (inventory[index].quantity <= 0) {
      inventory.splice(index, 1);
    }

    await Profile.findOneAndUpdate(
      { _id: profileId },
      {
        inventory,
      }
    );

    return inventory;
  };
};
