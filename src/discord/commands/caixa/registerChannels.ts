import { createCommand } from '#base';
import { db } from '#database';
import { res } from '#functions';
import { createMediaGallery, createRow, Separator } from '@magicyan/discord';
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle } from 'discord.js';

createCommand({
    name: 'banco',
    description: 'Gerencia o sistema de caixa.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'caixa',
            description: 'Define o canal principal do caixa.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: 'Selecione o canal do caixa.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        },
        {
            name: 'logs',
            description: 'Define o canal de logs do caixa.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'canal',
                    description: 'Selecione o canal de logs.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        },
    ],

    async run(interaction) {
        const { options } = interaction;
        const doc = await db.guilds.get(interaction.guildId);
        const canal = options.getChannel('canal', true);

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

        switch (options.getSubcommand(true)) {
            case 'caixa': {
                doc.channels!.caixa = canal.id;
                await doc.save();
                try {
                    const channel = await interaction.client.channels.fetch(canal.id);
                    if (channel?.isTextBased() && 'send' in channel) {
                        await channel.send(
                            res.bravery(createMediaGallery(constants.images.caixa), Separator.Default, row),
                        );
                    }
                    return interaction.reply(
                        res.success(`${constants.emojis.gear} Canal de notificações definido para: <#${canal.id}>.`),
                    );
                } catch (error) {
                    return interaction.reply(
                        res.danger(
                            `-# *Não foi possível enviar uma mensagem para o canal <#${canal.id}>. Ocrreu um erro ou eu 
                             não tenho permissão para enviar mensagens lá.*`,
                        ),
                    );
                }
            }
            case 'logs': {
                doc.channels!.logsCaixa = canal.id;
                await doc.save();
                return interaction.reply(
                    res.success(`${constants.emojis.gear} Canal de notificações definido para: <#${canal.id}>.`),
                );
            }

            default: {
                return interaction.reply(res.warning('Subcomando inválido.'));
            }
        }
    },
});
