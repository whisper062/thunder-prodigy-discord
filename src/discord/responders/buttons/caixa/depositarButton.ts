import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';
import { createMediaGallery, createRow, Separator } from '@magicyan/discord';
import { ButtonBuilder, ButtonStyle } from 'discord.js';

createResponder({
    customId: 'depositar_caixa',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const { member } = interaction;
        const guild = await db.guilds.get(interaction.guild.id);

        const row = createRow(
            new ButtonBuilder({
                custom_id: 'deposito_legal',
                label: 'Deposito Legal',
                style: ButtonStyle.Secondary,
            }),
            new ButtonBuilder({
                custom_id: 'deposito_ilegal',
                label: 'Deposito Ilegal',
                style: ButtonStyle.Secondary,
            }),
        );

        if (!guild.channels?.logsCaixa) {
            await interaction.reply(res.danger('-# *O canal de logs não está configurado neste servidor.*'));
            return;
        }

        if (
            !(
                member.roles.cache.has('1428979128727765075') ||
                member.roles.cache.has('1428981750054256752') ||
                member.permissions.has('Administrator')
            )
        ) {
            await interaction.reply(res.danger('-# *Você não tem permissão pra utilizar o caixa.*'));
        } else {
            await interaction.reply(
                res.default(createMediaGallery(constants.images.depositar), Separator.Default, row),
            );
        }
    },
});
