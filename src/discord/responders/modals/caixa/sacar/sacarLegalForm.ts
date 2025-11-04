import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';

createResponder({
    customId: 'saque_legalform',
    types: [ResponderType.ModalComponent],
    cache: 'cached',
    async run(interaction) {
        const { fields } = interaction;
        const guild = await db.guilds.get(interaction.guild.id);

        const dinheiro = parseInt(fields.getTextInputValue('saque_dinheirolegal')) || 0;

        if (!Number.isInteger(dinheiro) || dinheiro <= 0) {
            await interaction.reply(res.danger('Use apenas números inteiros positivos nos campos.'));
            return;
        }

        if (dinheiro == 0) {
            await interaction.reply('Você não pode sacar uma quantia de 0 em todos os campos.');
            return;
        }

        if (dinheiro > 0 && (guild.money?.dinheiroLimpo ?? 0) < dinheiro) {
            await interaction.reply(res.danger('Você não tem dinheiro suficiente para sacar essa quantia.'));
            return;
        }

        await db.guilds.inc(interaction.guild.id, {
            'money.dinheiroLimpo': -dinheiro,
        });

        await interaction.reply(
            res.danger(`Você sacou:\nTotal: ${dinheiro}\nNovo Total: ${(guild.money?.dinheiroLimpo ?? 0) - dinheiro} `),
        );
    },
});
