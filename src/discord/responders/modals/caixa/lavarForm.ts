import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';
import { brBuilder } from '@magicyan/discord';

createResponder({
    customId: 'lavar_form',
    types: [ResponderType.ModalComponent],
    cache: 'cached',
    async run(interaction) {
        const { fields } = interaction;

        const guild = await db.guilds.get(interaction.guild.id);
        const macos = parseInt(fields.getTextInputValue('lavar_macos')) || 0;
        const rolos = parseInt(fields.getTextInputValue('lavar_rolos')) || 0;
        const dinheiro = parseInt(fields.getTextInputValue('lavar_dinheiro')) || 0;
        const total = macos * 600 + rolos * 60;

        if (![macos, rolos, dinheiro].every((n) => Number.isInteger(n) && n >= 0)) {
            interaction.reply(res.danger('Use apenas números inteiros positivos nos campos.'));
            return;
        }

        if ((macos && guild.money!.macos < macos) || (rolos && guild.money!.rolos < rolos)) {
            await interaction.reply(
                res.danger('-# *Você não possui maços ou rolos suficientes para lavar essa quantidade.*'),
            );
            return;
        }

        await db.guilds.inc(interaction.guild.id, {
            'money.macos': -macos,
            'money.rolos': -rolos,
            'money.dinheiroSujo': -total,
            'money.dinheiroLimpo': dinheiro,
        });
        await interaction.reply(
            res.success(
                brBuilder(
                    'Você lavou:',
                    `Maços: ${macos}`,
                    `Rolos: ${rolos}`,
                    `Dinheiro Sujo: $${total.toLocaleString()}`,
                    `Dinheiro Limpo: $${dinheiro.toLocaleString()}`,
                ),
            ),
        );
    },
});
