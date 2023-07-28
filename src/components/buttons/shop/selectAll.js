module.exports = {
    data: {
      name: 'selectAll',
    },
  
    async execute(interaction, client) {
      const embed = await client.selectSome(interaction, null);

      if (!embed) {
        await interaction.deferUpdate();
        return;
      }
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  