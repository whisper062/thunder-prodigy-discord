import { createResponder, ResponderType } from '#base';
import { res } from '#functions';

createResponder({
  customId: 'register_form',
  types: [ResponderType.ModalComponent],
  cache: 'cached',
  async run(interaction) {
    const { fields, member } = interaction;
    const name = fields.getTextInputValue('name');
    const tags = ['1429166018365751498', '1428982095191212065'];

    try {
      await member.setNickname(name);
      await member.roles.add(tags);
      await interaction.reply(res.success(`-# *Seu nickname foi alterado para **${name}** com sucesso!*`));
    } catch (error) {
      await interaction.reply(res.danger('-# *Ocorreu um erro ao alterar seu nickname.*'));
    }
  },
});
