import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
    customId: 'sacar_caixa',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const { member } = interaction;
        const guild = await db.guilds.get(interaction.guild.id);

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
            await interaction.showModal({
                title: `Maços: ${guild.money?.macos} | Rolos: ${guild.money?.rolos} | Notas: ${guild.money?.notas}`,
                customId: 'sacar_form',
                components: createModalFields(
                    createLabel({
                        label: 'Maço de dinheiro:',
                        description: 'Escreva a quantia de maços que deseja sacar do caixa.',
                        component: new TextInputBuilder({
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            placeholder: 'Ex: 5',
                            custom_id: 'sacar_macos',
                            required: false,
                        }),
                    }),
                    createLabel({
                        label: 'Rolo de dinheiro:',
                        description: 'Escreva a quantia de rolos que deseja sacar do caixa.',
                        component: new TextInputBuilder({
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            placeholder: 'Ex: 5',
                            custom_id: 'sacar_rolos',
                            required: false,
                        }),
                    }),
                    createLabel({
                        label: 'Nota de dinheiro:',
                        description: 'Escreva a quantia de notas que deseja sacar do caixa.',
                        component: new TextInputBuilder({
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            placeholder: 'Ex: 5',
                            custom_id: 'sacar_notas',
                            required: false,
                        }),
                    }),
                ),
            });
        }
    },
});
