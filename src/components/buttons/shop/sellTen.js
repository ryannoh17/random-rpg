export default {
  data: {
    name: 'sellTen',
  },

  async execute(interaction, client) {
    const embed = await client.sellSome(interaction, 10);

    if (!embed) {
      await interaction.deferUpdate();
      return;
    }

    await interaction.update({
      embeds: [embed],
    });
  },
};
