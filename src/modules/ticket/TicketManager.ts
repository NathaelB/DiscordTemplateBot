import { BaseModel } from "@discord-factory/storage-next";
import Ticket from "App/database/models/Ticket";
import { TextChannel, User } from "discord.js";


export default class TicketManager {

    private readonly ticket: TextChannel
    private readonly user: User

    constructor (ticket: TextChannel, user: User) {
        this.user = user
        this.ticket = ticket
    }

    public getUser (): User {
        return this.user
      }
    
      public getTicket (): TextChannel {
        return this.ticket
      }
    
      public async saveToDatabase () {
        const ticket = await Ticket.findBy('user_id', this.getUser().id)
        if (ticket) return
        return await Ticket.create({
          ticket_id: this.getTicket().id,
          user_id: this.getUser().id,

        })
      }
    
      public async deleteFromDatabase (): Promise<void> {
        const ticket = await Ticket.findBy('ticket_id', this.getTicket().id)
    
        return await ticket.delete()
      }
}