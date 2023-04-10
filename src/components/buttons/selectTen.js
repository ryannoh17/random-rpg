module.exports = {
    data: {
      name: 'selectTen',
    },
  
    async execute(interaction, client) {
      const embed = await client.selectSome(interaction, 10);

      if (!embed) {
        return;
      }
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  