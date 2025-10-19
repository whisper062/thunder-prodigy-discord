import { createEvent } from '#base';
import { res } from '#functions';
import { brBuilder, createMediaGallery, createRow, createThumbArea, Separator } from '@magicyan/discord';
import { ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js';

createEvent({
  name: 'welcomeSystem',
  event: 'guildMemberAdd',
  async run(member) {
    const channelId = '1428851941298933781';
    const channel = member.guild.channels.cache.get(channelId);

    const row = createRow(
      new ButtonBuilder({
        style: ButtonStyle.Primary,
        custom_id: `registerButton/${member.id}`,
        label: 'Registrar-se',
        emoji: constants.emojis.gear,
      }),
    );

    try {
      if (!channel || channel.type !== ChannelType.GuildText) return;
      const user = await member.user.fetch(true);
      const bannerURL = user.bannerURL({ size: 512 });
      const banner = bannerURL ? createMediaGallery(bannerURL) : null;

      channel.send(
        res.success(
          banner,
          createThumbArea({
            content: brBuilder(`# Bem vindo ${member.displayName}`, 'Faça registro e ganhe acesso ao servidor!'),
            thumbnail: member.displayAvatarURL({ size: 4096 }),
          }),
          Separator.Default,
          row,
        ),
      );
    } catch (error) {
      if (!channel || channel.type !== ChannelType.GuildText) return;
      channel.send(res.danger('-# *Aconteceu um erro, contate um responsável.*'));
    }
  },
});
