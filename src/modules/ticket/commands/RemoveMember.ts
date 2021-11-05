import { Command, BaseCommand } from 'ioc:factory/Core/Command'
import { CommandInteraction, MessageEmbed, TextChannel } from 'discord.js'

import { Colors } from '@discord-factory/colorize'
import { Category, Roles } from 'App/settings'

@Command({
  scope: 'GUILDS',
  options: {
    name: 'removemember',
    description: 'Permet de supprimer un membre dans un ticket',
    options: [
      {name: "member", description: "Le membre en question", type: 'USER', required: true},
    ]
  },
  permissions: [
    {id: Roles.ADMIN, type: 'ROLE', permission: true}
  ]
})
export default class RemoveMember extends BaseCommand {
  public async run (interaction: CommandInteraction): Promise<void> {
    const data = interaction.options.get('member')
    const target = interaction.guild?.members.resolve(data!.user!.id)

    if (!(interaction.channel instanceof TextChannel && interaction.channel.parent?.id === Category.TICKET)) {
      await interaction.reply({
        embeds: [new MessageEmbed({
          title: `Vous devez être un dans un ticket`,
          description: `Pour pouvoir supprimer un membre dans un ticket, il faut se trouver dans un ticket !`,
          color: Colors.INVISIBLE,
        })],
        ephemeral: true
      })
    }
    await interaction.reply({
      embeds: [new MessageEmbed({
        title: `Un membre viens d'être supprimé du ticket`,
        description: `${target!.user} viens d'être supprimé du ticket !`,
        color: Colors.INVISIBLE
      })]
    })

    const channel = interaction.channel as TextChannel
    await channel.permissionOverwrites.edit(
      target!.id, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: false
      }
    )


  }
}