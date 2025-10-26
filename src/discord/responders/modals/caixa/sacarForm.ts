import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { caixaIlegalLogs, res } from '#functions';

createResponder({
    customId: 'sacar_form',
    types: [ResponderType.ModalComponent],
    cache: 'cached',
    async run(interaction) {
        const { fields } = interaction;
        const guild = await db.guilds.get(interaction.guild.id);

        const macos = parseInt(fields.getTextInputValue('sacar_macos')) || 0;
        const rolos = parseInt(fields.getTextInputValue('sacar_rolos')) || 0;
        const notas = parseInt(fields.getTextInputValue('sacar_notas')) || 0;
        const total = macos * 600 + rolos * 60 + notas * 6;

        if (![macos, rolos, notas].every((n) => Number.isInteger(n) && n >= 0)) {
            interaction.reply(res.danger('Use apenas números inteiros positivos nos campos.'));
            return;
        }

        if (total == 0) {
            await interaction.reply('Você não pode sacar uma quantia de 0 em todos os campos.');
            return;
        }

        if (
            (macos > 0 && (guild.money?.macos ?? 0) < macos) ||
            (rolos > 0 && (guild.money?.rolos ?? 0) < rolos) ||
            (notas > 0 && (guild.money?.notas ?? 0) < notas)
        ) {
            await interaction.reply(res.danger('Você não tem dinheiro suficiente para sacar essa quantia.'));
            return;
        }

        await db.guilds.inc(interaction.guild.id, {
            'money.dinheiroSujo': -total,
            'money.macos': -macos,
            'money.rolos': -rolos,
            'money.notas': -notas,
        });

        await interaction.reply(
            res.danger(
                `Você sacou:\nMaços: ${macos}\nRolos: ${rolos}\nNotas: ${notas} \nNovo Total: $${
                    (guild.money?.dinheiroSujo ?? 0) - total
                }`,
            ),
        );
        caixaIlegalLogs(false, `${guild.channels?.logsCaixa}`, total, macos, rolos, notas, interaction);
    },
});
