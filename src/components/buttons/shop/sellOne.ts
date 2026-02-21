export default {
  data: {
    name: 'sellOne',
  },

  async execute(interaction, client) {
    const embed = await client.sellSome(interaction, 1);

    if (!embed) {
      await interaction.deferUpdate();
      return;
    }

    await interaction.update({
      embeds: [embed],
    });
  },
};
