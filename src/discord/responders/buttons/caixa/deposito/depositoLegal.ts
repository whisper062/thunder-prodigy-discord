import { createResponder, ResponderType } from '#base';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
    customId: 'deposito_legal',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        interaction.showModal({
            title: 'Deposito de dinheiro legal',
            customId: 'depositar_legalform',
            components: createModalFields(
                createLabel({
                    label: 'Quantidade:',
                    description: 'Escreva a quantia de dinheiro limpo que deseja depositar.',
                    component: new TextInputBuilder({
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'Ex: 3540',
                        custom_id: 'depositar_dinheirolegal',
                        required: true,
                    }),
                }),
            ),
        });
    },
});
