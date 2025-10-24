import { createResponder, ResponderType } from '#base';

createResponder({
    customId: 'sacar_form',
    types: [ResponderType.ModalComponent],
    cache: 'cached',
    async run(interaction) {
        const { fields } = interaction;
        const macos = fields.getTextInputValue('sacar_macos');
        const rolos = fields.getTextInputValue('sacar_rolos');
        const notas = fields.getTextInputValue('sacar_notas');

        await interaction.reply(`Você solicitou sacar:\nMaços: ${macos}\nRolos: ${rolos}\nNotas: ${notas}`);
    },
});
