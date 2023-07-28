module.exports = {
    data: {
      name: 'selectTen',
    },
  
    async execute(interaction, client) {
      const embed = await client.selectSome(interaction, 10);

      if (!embed) {
        await interaction.deferUpdate();
        return;
      }
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  