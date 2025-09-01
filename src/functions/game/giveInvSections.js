export default (client) => {
  client.giveInvSections = async (inventory, num) => {
    const matArray = inventory[0].map((items) => {
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
    const equipArray = inventory[2].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    if (Number.isInteger(num)) {
      matArray[0] = `**${matArray[0]}**`;
    }

    const matList = matArray.join('\n');
    const potionList = potionArray.join('\n');
    const equipList = equipArray.join('\n');

    return [matList, potionList, equipList];
  };
};
