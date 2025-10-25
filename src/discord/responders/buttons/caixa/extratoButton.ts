import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';

createResponder({
    customId: 'extrato_caixa',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const guild = await db.guilds.get(interaction.guild!.id);
        await interaction.reply(res.default(`Extrato do Caixa:\nMaços: ${guild.money?.macos}\nRolos: ${guild.money?.rolos}\nNotas: ${guild.money?.notas}\nTotal em Dinheiro Sujo: $${guild.money?.dinheiroSujo}`));
    },
});
