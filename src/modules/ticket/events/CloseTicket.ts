import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Interaction, MessageEmbed, TextChannel } from 'discord.js'
import Ticket from 'App/database/models/Ticket'
import { Roles } from 'App/settings'
import { Application } from '@discord-factory/core-next'
import { Colors } from '@discord-factory/colorize'

@Event('interactionCreate')
export default class CloseTicket extends BaseEvent {
  public async run (interaction: Interaction): Promise<void> {
    if (!interaction.isButton()) return
    if (interaction.customId === 'closeTicket') {
      const member = interaction.guild?.members.resolve(interaction.user.id)

      
      if (member!.roles.cache.some(role => role.id === Roles.ADMIN)) {
        const data = await Ticket.findBy('ticket_id', interaction.channel?.id) as Ticket
        await data.delete()
        const ticket = interaction.channel as TextChannel
        await ticket.delete()
        return
      }

      await interaction.reply({
        embeds: [new MessageEmbed({
          author: {name: `Permission Insuffisante`, iconURL: Application.getClient().user!.displayAvatarURL()},
          color: Colors.RED_500
        })],
        ephemeral: true
      })
    }
  }
}