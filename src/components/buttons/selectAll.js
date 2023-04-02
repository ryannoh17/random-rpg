module.exports = {
    data: {
      name: 'selectAll',
    },
  
    async execute(interaction, client) {
      const embed = await client.selectSome(interaction, null);
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  