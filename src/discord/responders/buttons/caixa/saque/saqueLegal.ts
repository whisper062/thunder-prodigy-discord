import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
    customId: 'saque_legal',
    types: [ResponderType.Button],
    cache: 'cached',
    async run(interaction) {
        const guild = await db.guilds.get(interaction.guild.id);
        interaction.showModal({
            title: `Saque de dinheiro legal | Total: ${guild.money?.dinheiroLimpo}`,
            customId: 'saque_legalform',
            components: createModalFields(
                createLabel({
                    label: 'Quantidade:',
                    description: 'Escreva a quantia de dinheiro limpo que deseja sacar.',
                    component: new TextInputBuilder({
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        placeholder: 'Ex: 3540',
                        custom_id: 'saque_dinheirolegal',
                        required: true,
                    }),
                }),
            ),
        });
    },
});
