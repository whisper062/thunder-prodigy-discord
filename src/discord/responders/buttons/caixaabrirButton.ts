import { createResponder, ResponderType } from '#base';
import { res } from '#functions';
import { createMediaGallery, createRow, Separator } from '@magicyan/discord';
import { ButtonBuilder, ButtonStyle } from 'discord.js';

createResponder({
    customId: 'caixa_abrir',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const row = createRow(
            new ButtonBuilder({
                custom_id: 'sacar_caixa',
                style: ButtonStyle.Secondary,
                label: 'Sacar',
            }),
            new ButtonBuilder({
                custom_id: 'depositar_caixa',
                style: ButtonStyle.Secondary,
                label: 'Depositar',
            }),
            new ButtonBuilder({
                custom_id: 'extrato_caixa',
                style: ButtonStyle.Secondary,
                label: 'Extrato',
            }),
        );
        await interaction.reply(res.bravery(createMediaGallery(constants.images.caixa), Separator.Default, row));
    },
});
