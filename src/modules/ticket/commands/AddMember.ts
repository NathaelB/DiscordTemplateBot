import { Command, BaseCommand } from 'ioc:factory/Core/Command'
import { CommandInteraction, MessageEmbed, TextChannel } from 'discord.js'
import { Category, Roles } from 'App/settings'
import { Colors } from '@discord-factory/colorize'

@Command({
  scope: 'GUILDS',
  options: {
    name: 'addmember',
    description: 'addmember description',
    options: [
      {name: "member", description: "Le membre en question", type: 'USER', required: true},
    ]
  },
  permissions: [
    {id: Roles.ADMIN, type: 'ROLE', permission: true}
  ]
})
export default class AddMember extends BaseCommand {
  public async run (interaction: CommandInteraction): Promise<void> {
    const data = interaction.options.get('member')
    const target = interaction.guild?.members.resolve(data!.user!.id)

    if (!(interaction.channel instanceof TextChannel && interaction.channel.parent?.id === Category.TICKET)) {
      await interaction.reply({
        embeds: [new MessageEmbed({
          title: `Vous devez être un dans un ticket`,
          description: `Pour pouvoir ajouter un membre dans un ticket, il faut se trouver dans un ticket !`,
          color: Colors.INVISIBLE,
        })],
        ephemeral: true
      })
    }

    await interaction.reply({
      embeds: [new MessageEmbed({
        title: `Ajout d'un membre dans le ticket`,
        description: `${target!.user} viens d'être ajouté au ticket !`,
        color: Colors.INVISIBLE
      })]
    })
    const channel = interaction.channel as TextChannel
    await channel.permissionOverwrites.edit(
      target!.id, {
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
        SEND_MESSAGES: true,
        CREATE_INSTANT_INVITE: false,
        MENTION_EVERYONE: false
      }
    )
  }
}