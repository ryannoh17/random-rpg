export default {
  data: {
    name: 'selectMaterialSeg',
  },

  async execute(interaction, client) {
    client.switchInvTab(interaction, 1);
  },
};
