import { createResponder, ResponderType } from '#base';
import { res } from '#functions';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
    customId: 'lavar_caixa',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const { member } = interaction;
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
                title: 'Lavar Caixa',
                customId: 'lavar_form',
                components: createModalFields(
                    createLabel({
                        label: 'Maço de dinheiro:',
                        description: 'Escreva a quantia de maços que deseja lavar do caixa.',
                        component: new TextInputBuilder({
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            placeholder: 'Ex: 5',
                            custom_id: 'lavar_macos',
                            required: false,
                        }),
                    }),
                    createLabel({
                        label: 'Rolo de dinheiro:',
                        description: 'Escreva a quantia de rolos que deseja lavar do caixa.',
                        component: new TextInputBuilder({
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            placeholder: 'Ex: 5',
                            custom_id: 'lavar_rolos',
                            required: false,
                        }),
                    }),
                    createLabel({
                        label: 'Quantidade que retornou limpo:',
                        description: 'Escreva a quantia de dinheiro limpo que retornou após a lavagem.',
                        component: new TextInputBuilder({
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            placeholder: 'Ex: 4300',
                            custom_id: 'lavar_dinheiro',
                            required: true,
                        }),
                    }),
                ),
            });
        }
    },
});
