export default {
  data: {
    name: 'sellAll',
  },

  async execute(interaction, client) {
    const embed = await client.sellSome(interaction, null);

    if (!embed) {
      await interaction.deferUpdate();
      return;
    }

    await interaction.update({
      embeds: [embed],
    });
  },
};
