import { createResponder, ResponderType } from '#base';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
    customId: 'deposito_ilegal',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        await interaction.showModal({
            title: 'Depositar Caixa',
            customId: 'depositar_form',
            components: createModalFields(
                createLabel({
                    label: 'Maço de dinheiro:',
                    description: 'Escreva a quantia de maços que deseja depositar do caixa.',
                    component: new TextInputBuilder({
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'Ex: 5',
                        custom_id: 'depositar_macos',
                        required: false,
                    }),
                }),
                createLabel({
                    label: 'Rolo de dinheiro:',
                    description: 'Escreva a quantia de rolos que deseja depositar do caixa.',
                    component: new TextInputBuilder({
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'Ex: 5',
                        custom_id: 'depositar_rolos',
                        required: false,
                    }),
                }),
                createLabel({
                    label: 'Nota de dinheiro:',
                    description: 'Escreva a quantia de notas que deseja depositar do caixa.',
                    component: new TextInputBuilder({
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'Ex: 5',
                        custom_id: 'depositar_notas',
                        required: false,
                    }),
                }),
            ),
        });
    },
});
