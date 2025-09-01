export default {
  data: {
    name: 'selectEquipmentSeg',
  },

  async execute(interaction, client) {
    client.switchInvTab(interaction, 3);
  },
};
