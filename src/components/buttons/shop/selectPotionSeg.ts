export default {
  data: {
    name: 'selectPotionSeg',
  },

  async execute(interaction, client) {
    client.switchInvTab(interaction, 2);
  },
};
