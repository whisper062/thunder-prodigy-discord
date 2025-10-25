import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { res } from '#functions';

createResponder({
    customId: 'depositar_form',
    types: [ResponderType.ModalComponent],
    cache: 'cached',
    async run(interaction) {
        const { fields } = interaction;
        const macos = parseInt(fields.getTextInputValue('depositar_macos')) || 0;
        const rolos = parseInt(fields.getTextInputValue('depositar_rolos')) || 0;
        const notas = parseInt(fields.getTextInputValue('depositar_notas')) || 0;
        const total = macos * 600 + rolos * 60 + notas * 6;

        if (![macos, rolos, notas].every((n) => Number.isInteger(n) && n >= 0)) {
            interaction.reply(res.danger('Use apenas números inteiros positivos nos campos.'));
            return;
        }

        if (total == 0) {
            await interaction.reply(res.danger('Você não utilizou números ou utilizou 0 em todos os campos.'));
            return;
        }
        await db.guilds.inc(interaction.guild!.id, {
            'money.dinheiroSujo': total,
            'money.macos': macos,
            'money.rolos': rolos,
            'money.notas': notas,
        });

        await interaction.reply(
            res.success(
                `Você depositou:\nMaços: ${macos}\nRolos: ${rolos}\nNotas: ${notas}\nTotal: $${total.toLocaleString()}`,
            ),
        );
    },
});
