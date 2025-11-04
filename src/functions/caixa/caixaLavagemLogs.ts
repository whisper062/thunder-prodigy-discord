import { db } from '#database';
import { brBuilder, createSection } from '@magicyan/discord';
import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { res } from '../utils/res.js';

export async function caixaLavagemLogs(
    channelId: string,
    quantity: number,
    quantityClean: number,
    macos: number,
    rolos: number,
    interaction: any,
) {
    const channel = await interaction.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) return;
    const user = interaction.user.id;

    await channel.send(
        res.warning(
            brBuilder(
                `**Lavagem no Caixa**`,
                `Tipo: Ilegal`,
                `Usuário: <@${user}>`,
                `**Total Sujo:** $${quantity}`,
                `**Total Limpo:** $${quantityClean}`,
            ),
            createSection({
                content: 'Maços:',
                button: new ButtonBuilder({
                    disabled: true,
                    label: `${macos}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummyLavagem1',
                }),
            }),
            createSection({
                content: 'Rolos:',
                accessory: new ButtonBuilder({
                    disabled: true,
                    label: `${rolos}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummyLavagem2',
                }),
            }),
            createSection({
                content: 'Total Sujo:',
                accessory: new ButtonBuilder({
                    disabled: true,
                    label: `${quantity}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummyLavagem3',
                }),
            }),
            createSection({
                content: 'Total Limpo:',
                accessory: new ButtonBuilder({
                    disabled: true,
                    label: `${quantityClean}`,
                    style: ButtonStyle.Secondary,
                    custom_id: 'dummyLavagem4',
                }),
            }),
        ),
    );
    await db.caixaLogs.create({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        tipo: 'lavagem',
        natureza: 'ilegal',
        total: quantity,
        totalLimpo: quantityClean,
        macos: macos,
        rolos: rolos,
        notas: 0
    });
}
