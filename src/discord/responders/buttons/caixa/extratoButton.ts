import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';
import { brBuilder, Separator } from '@magicyan/discord';

createResponder({
    customId: 'extrato_caixa',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const guild = await db.guilds.get(interaction.guild.id);

        if (!guild.channels?.logsCaixa) {
            await interaction.reply(res.danger('-# *O canal de logs não está configurado neste servidor.*'));
            return;
        }

        const transacoes = await db.caixaLogs.find({ guildId: interaction.guild.id }).sort({ createdAt: -1 }).limit(20);

        const nomes = await Promise.all(
            transacoes.map(async (t) => {
                try {
                    const member = await interaction.guild.members.fetch(t.userId);
                    return member.displayName;
                } catch {
                    const user = await interaction.client.users.fetch(t.userId).catch(() => null);
                    return user?.username || 'Desconhecido';
                }
            }),
        );

        const prg = '```';
        const lista =
            transacoes
                .map((t, i) => {
                    if (t.tipo?.toLowerCase() === 'lavagem') {
                        return `\n[${i + 1}] ${nomes[i]} - ${t.tipo.toUpperCase()} ${t.natureza.toUpperCase()} - $ ${
                            t.total
                        }/${t.totalLimpo}`;
                    }
                    return `\n[${i + 1}] ${nomes[i]} - ${t.tipo.toUpperCase()} ${t.natureza.toUpperCase()} - $ ${
                        t.total
                    }`;
                })
                .join('') || 'Nenhuma transação registrada.';

        await interaction.reply(
            res.default(
                brBuilder(
                    `**Extrato do Caixa:**`,
                    `Maços: ${guild.money?.macos || 0}`,
                    `Rolos: ${guild.money?.rolos || 0}`,
                    `Notas: ${guild.money?.notas || 0}`,
                    `Dinheiro Sujo: $${guild.money?.dinheiroSujo || 0}`,
                    `Dinheiro Limpo: $${guild.money?.dinheiroLimpo || 0}`,
                ),
                Separator.Default,
                prg + 'ini\n' + lista + '\n' + prg,
            ),
        );
    },
});
