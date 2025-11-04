import { db } from '#database';
import { brBuilder, createSection } from '@magicyan/discord';
import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { res } from '../utils/res.js';

export async function caixaIlegalLogs(
    state: boolean,
    channelId: string,
    quantity: number,
    macos: number,
    rolos: number,
    notas: number,
    interaction: any,
) {
    const channel = await interaction.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) return;
    const user = interaction.user.id;
    const color = state ? res.success : res.danger;
    const type = state ? 'Depósito' : 'Saque';

    await channel.send(
        color(
            brBuilder(`**${type} no Caixa**`, `Tipo: Ilegal`, `Usuário: <@${user}>`, `**Total:** $${quantity}`),
            createSection({
                content: 'Maços:',
                button: new ButtonBuilder({
                    disabled: true,
                    label: `${macos}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummy',
                }),
            }),
            createSection({
                content: 'Rolos:',
                accessory: new ButtonBuilder({
                    disabled: true,
                    label: `${rolos}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummy2',
                }),
            }),
            createSection({
                content: 'Notas:',
                button: new ButtonBuilder({
                    disabled: true,
                    label: `${notas}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummy3',
                }),
            }),
        ),
    );
    await db.caixaLogs.create({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        tipo: state ? 'deposito' : 'saque',
        natureza: 'ilegal',
        total: quantity,
        macos: macos,
        rolos: rolos,
        notas: notas,
    });
}
