import { createResponder, ResponderType } from '#base';
import { res } from '#functions';
import { createLabel, createModalFields } from '@magicyan/discord';
import { ComponentType, TextInputBuilder, TextInputStyle } from 'discord.js';

createResponder({
  customId: 'registerButton/:userId',
  types: [ResponderType.Button],
  cache: 'cached',
  async run(interaction, { userId }) {
    try {
      if (interaction.user.id !== userId) {
        await interaction.reply(res.danger('-# *Esse resgistro não foi feito para você*'));
        return;
      } else {
        await interaction.showModal({
          title: 'Bem vindo a Thunder',
          customId: 'form',
          components: createModalFields(
            createLabel({
              label: 'Nome',
              description: 'Nome do seu personagem',
              component: new TextInputBuilder({
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                placeholder: 'use a ortográfia correta',
                custom_id: 'name',
                required: true,
                min_length: 5,
                max_length: 25,
              }),
            }),
          ),
        });
      }
    } catch (error) {
      await interaction.reply(res.danger('-# *Aconteceu um erro, contate um responsável.*'));
    }
  },
});
