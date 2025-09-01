export default {
    data: {
      name: 'buyOne',
    },
  
    async execute(interaction, client) {
      const embed = await client.buySome(interaction, 1);
  
      if (!embed) {
        await interaction.deferUpdate();
        return;
      }
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  