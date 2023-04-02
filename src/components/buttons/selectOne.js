module.exports = {
  data: {
    name: 'selectOne',
  },

  async execute(interaction, client) {
    const embed = await client.selectSome(interaction, 1);

    await interaction.update({
      embeds: [embed],
    });
  },
};
