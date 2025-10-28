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
        {
            name: 'lavar',
            description: 'Lava dinheiro sujo em dinheiro limpo usando maços ou rolos.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'maços',
                    description: 'Selecione a quantidade maços.',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
                {
                    name: 'rolos',
                    description: 'Selecione a quantidade rolos.',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
            ],
        },
    ],

    async run(interaction) {
        const { options } = interaction;
        const doc = await db.guilds.get(interaction.guildId);

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
                const canal = options.getChannel('canal', true);
                doc.channels!.caixa = canal.id;
                await doc.save();
                try {
                    const channel = await interaction.client.channels.fetch(canal.id);
                    if (channel?.isTextBased() && 'send' in channel) {
                        await channel.send(
                            res.bravery(createMediaGallery(constants.images.caixathunder), Separator.Default, row),
                        );
                    }
                    return interaction.reply(
                        res.success(`${constants.emojis.gear} Canal de caixa definido para: <#${canal.id}>.`),
                    );
                } catch (error) {
                    return interaction.reply(
                        res.danger(
                            `-# *Não foi possível enviar uma mensagem para o canal <#${canal.id}>. Ocorreu um erro ou eu 
                             não tenho permissão para enviar mensagens lá.*`,
                        ),
                    );
                }
            }
            case 'logs': {
                const canal = options.getChannel('canal', true);
                doc.channels!.logsCaixa = canal.id;
                await doc.save();
                return interaction.reply(
                    res.success(`${constants.emojis.gear} Canal de notificações definido para: <#${canal.id}>.`),
                );
            }
            case 'lavar': {
                const macos = options.getInteger('maços');
                const rolos = options.getInteger('rolos');

                if (!macos && !rolos) {
                    return interaction.reply(res.warning('-# *Você precisa especificar maços ou rolos para lavar.*'));
                }

                if ((macos && macos < 1) || (rolos && rolos < 1)) {
                    return interaction.reply(res.danger('-# *A quantidade deve ser maior que zero!*'));
                }

                if ((macos && doc.money!.macos < macos) || (rolos && doc.money!.rolos < rolos)) {
                    return interaction.reply(
                        res.danger('-# *Você não possui maços ou rolos suficientes para lavar essa quantidade.*'),
                    );
                }
                if (macos) {
                    await db.guilds.inc(interaction.guild.id, {
                        'money.macos': -macos,
                        'money.dinheiroSujo': -(macos * 600),
                        'money.dinheiroLimpo': macos * 600,
                    });
                }
                if (rolos) {
                    await db.guilds.inc(interaction.guild.id, {
                        'money.rolos': -rolos,
                        'money.dinheiroSujo': -(rolos * 60),
                        'money.dinheiroLimpo': rolos * 60,
                    });
                }
                return interaction.reply(res.success(`-# *Lavagem concluída com sucesso!*`));
            }

            default: {
                return interaction.reply(res.warning('-# *Subcomando inválido.*'));
            }
        }
    },
});
