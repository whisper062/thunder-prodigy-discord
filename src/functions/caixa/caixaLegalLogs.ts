import { db } from '#database';
import { brBuilder, createSection } from '@magicyan/discord';
import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { res } from '../utils/res.js';

export async function caixaLegalLogs(state: boolean, channelId: string, quantity: number, interaction: any) {
    const channel = await interaction.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) return;
    const user = interaction.user.id;
    const color = state ? res.success : res.danger;
    const type = state ? 'Depósito' : 'Saque';

    await channel.send(
        color(
            brBuilder(`**${type} no Caixa**`, `Tipo: Legal`, `Usuário: <@${user}>`, `**Total:** $${quantity}`),
            createSection({
                content: 'Total:',
                button: new ButtonBuilder({
                    disabled: true,
                    label: `${quantity}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'legallogsdummy',
                }),
            }),
        ),
    );
    await db.caixaLogs.create({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        tipo: state ? 'deposito' : 'saque',
        natureza: 'legal',
        total: quantity,
        macos: 0,
        rolos: 0,
        notas: 0,
    });
}
