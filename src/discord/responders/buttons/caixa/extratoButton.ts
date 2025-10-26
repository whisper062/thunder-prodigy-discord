import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';

createResponder({
    customId: 'extrato_caixa',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const guild = await db.guilds.get(interaction.guild.id);

        const transacoes = await db.caixaLogs.find({ guildId: interaction.guild.id }).sort({ createdAt: -1 }).limit(20);

        const lista =
            transacoes
                .map(
                    (t: any, i: number) =>
                        `${i + 1}. <@${t.userId}> - ${t.tipo.toUpperCase()} ${t.natureza} - R$ ${t.total}`,
                )
                .join('\n') || 'Nenhuma transação.';

        await interaction.reply(
            res.default(
                `Extrato do Caixa:\nMaços: ${guild.money?.macos || 0}\nRolos: ${guild.money?.rolos || 0}\nNotas: ${
                    guild.money?.notas || 0
                }\nDinheiro Sujo: $${guild.money?.dinheiroSujo || 0}\n\n${lista}`,
            ),
        );
    },
});
