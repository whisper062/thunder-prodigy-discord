import { createResponder, ResponderType } from '#base';
import { res } from '#functions';

createResponder({
  customId: 'form',
  types: [ResponderType.ModalComponent],
  cache: 'cached',
  async run(interaction) {
    const { fields, member } = interaction;
    const name = fields.getTextInputValue('name');

    try {
      await member.setNickname(name);
      await interaction.reply(res.success(`-# *Seu nickname foi alterado para **${name}** com sucesso!*`));
    } catch (error) {
      await interaction.reply(res.danger('-# *Ocorreu um erro ao alterar seu nickname.*'));
    }
  },
});
