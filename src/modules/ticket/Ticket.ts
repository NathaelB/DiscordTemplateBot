import { Command, BaseCommand } from 'ioc:factory/Core/Command'
import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js'
import { Colors } from '@discord-factory/colorize'
import { Application } from '@discord-factory/core-next'
import {Roles, Channels, Category} from '../../settings'


@Command({
  scope: 'GUILDS',
  options: {
    name: 'ticket',
    description: 'ticket description',
    options: []
  },
  permissions: [
    {id: Roles.ADMIN, type: 'ROLE', permission: true}
  ]
})
export default class Ticket extends BaseCommand {
  public async run (interaction: CommandInteraction): Promise<void> {
    const channel = interaction.guild?.channels.resolve(Channels.TICKET) as TextChannel

    const msg = new MessageEmbed({
      author: {name: `Ouvrir un ticket`},
      description: `Clique sur le bouton pour ouvrir un ticket`,
      color: Colors.INVISIBLE,
      footer: {
        text: `Nathael Template - 2021`,
        iconURL: Application.getClient().user!.displayAvatarURL()
      }
    })

    const button = new MessageButton({
      style: 'PRIMARY',
      customId: 'ticket-open',
      emoji: '🎟️',
      label: `Ouvrir un ticket`
    })

    await Promise.all([
      channel.send({
        embeds: [msg],
        components: [new MessageActionRow({
          components: [button]
        })]
      }),

      interaction.reply({
        embeds: [new MessageEmbed({
          author: {
            name: `Commande exécutée`, iconURL: Application.getClient().user!.displayAvatarURL()
          },
          description: `L'embed du ticket viens d'être généré dans le channel ${channel} !`,
          color: Colors.INVISIBLE
        })],
        ephemeral: true
      })
    ])



    
  }
}