import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { CategoryChannel, Interaction, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js'
import Ticket from 'App/database/models/Ticket'
import { Application } from '@discord-factory/core-next'
import { Colors } from '@discord-factory/colorize'
import { Category, Roles } from 'App/settings'
import TicketManager from '../TicketManager'

@Event('interactionCreate')
export default class OpenTicket extends BaseEvent {
  public async run (interaction: Interaction): Promise<void> {
    if (!interaction.isButton()) return
    if (interaction.customId === 'ticket-open') {
        const ticket = await Ticket.findBy({user_id: interaction.user.id}) as Ticket

        if (ticket) {
          const channel = interaction.guild?.channels.resolve(ticket.ticket_id) as TextChannel
          await interaction.reply({
            embeds: [new MessageEmbed({
              author: { name: `Tu as déjà un ticket ouvert`, iconURL: Application.getClient().user!.displayAvatarURL()},
              description: `Tu ne peux pas ouvrir un nouveau ticket, car tu en as déjà un : ${channel}`,
              color: Colors.INVISIBLE
            })],
            ephemeral: true
          })
          return
        }

        const category = interaction.guild?.channels.resolve(Category.TICKET) as CategoryChannel

        const channel = await category.guild.channels.create( `ticket-${interaction.user.username}`,{
          parent: category,
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            { id: interaction.guild!.roles.everyone.id, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']},
            { id: interaction.user.id, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'], deny: ['CREATE_INSTANT_INVITE', 'MENTION_EVERYONE']},
            { id: Roles.SUPPORT, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES']},
          ]
        }) as TextChannel
        
        const responseReaction = new MessageEmbed({
          author: {name: `Ton ticket a été crée`, iconURL: Application.getClient().user!.displayAvatarURL()},
          description: `${channel}`,
          color: Colors.INVISIBLE
        })
  
        await interaction.reply({
          embeds: [responseReaction],
          ephemeral: true
        })

        const data: TicketManager = new TicketManager(channel, interaction.user)
        await data.saveToDatabase()

        const closeButton = new MessageButton({
          style: 'DANGER',
          label: 'Fermer le ticket',
          customId: 'closeTicket'
        })

        const msg = new MessageEmbed({
          author: {name: `Ticket de ${interaction.user.username}`, iconURL: `${interaction.user!.displayAvatarURL()}`},
          description: `Bienvenue dans votre ${interaction.user}, vous pouvez indiquer votre cahier des charges (via la commande /addcdc) pour que **Welz** puisse prendre part de votre commande !`,
          color: Colors.INVISIBLE
        })
  
        await channel.send({
          embeds: [msg],
          components: [new MessageActionRow({
            components: [closeButton]
          })]
        })

    }
  }
}