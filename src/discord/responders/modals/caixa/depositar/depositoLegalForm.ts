import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { caixaLegalLogs, res } from '#functions';

createResponder({
    customId: 'depositar_legalform',
    types: [ResponderType.ModalComponent],
    cache: 'cached',
    async run(interaction) {
        const { fields } = interaction;
        const guild = await db.guilds.get(interaction.guild.id);
        const dinheiro = parseInt(fields.getTextInputValue('depositar_dinheirolegal')) || 0;

        if (!Number.isInteger(dinheiro) || dinheiro < 0) {
            await interaction.reply(res.danger('Use apenas números inteiros positivos no campo.'));
            return;
        }

        if (dinheiro == 0) {
            await interaction.reply(res.danger('Você não utilizou números ou utilizou 0 em todos os campos.'));
            return;
        }
        await db.guilds.inc(interaction.guild.id, {
            'money.dinheiroLimpo': dinheiro,
        });

        await interaction.reply(res.success(`Você depositou:\nTotal: $${dinheiro.toLocaleString()}`));

        caixaLegalLogs(true, `${guild.channels?.logsCaixa}`, dinheiro, interaction);
    },
});
