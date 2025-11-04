import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
    customId: 'saque_ilegal',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const guild = await db.guilds.get(interaction.guild.id);
        await interaction.showModal({
            title: `Maços: ${guild.money?.macos} | Rolos: ${guild.money?.rolos} | Notas: ${guild.money?.notas}`,
            customId: 'sacar_ilegalform',
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
    },
});
