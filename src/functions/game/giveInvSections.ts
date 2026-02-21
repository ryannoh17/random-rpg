export default (client) => {
  client.giveInvSections = async (inventory, num) => {
    const materialArray = inventory[0].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });
    const potionArray = inventory[1].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });
    const equipmentArray = inventory[2].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    if (Number.isInteger(num)) {
      materialArray[0] = `**${materialArray[0]}**`;
    }

    const matList = materialArray.join('\n');
    const potionList = potionArray.join('\n');
    const equipList = equipmentArray.join('\n');

    return [matList, potionList, equipList];
  };
};
