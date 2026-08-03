import { Injectable } from "@nestjs/common";
import { TicketStatusType } from "src/generated/prisma/client";
import { TicketService } from "./ticket.service";
import { TicketDataDto } from "./dto/ticket-data.dto";
import { TicketRepository } from "./ticket.repository";

@Injectable()
export class TicketValidationService {
  constructor(
    private readonly ticketService: TicketService,
    private readonly ticketRepository: TicketRepository
  ) {}

  async validateTicket(ticketData: TicketDataDto) {
    const { ticketId, routeId } = ticketData;

    const ticket = await this.ticketRepository.findByIdAndRoute(ticketId, routeId);

    if (ticket.status === TicketStatusType.USED) {
      return {
        success: false,
        result: "Ticket already used",
      };
    }

    if (ticket.status === TicketStatusType.CANCELED) {
      return {
        success: false,
        result: "Ticket canceled",
      };
    }

    if (ticket.expiresAt <= new Date() && ticket.status === TicketStatusType.ACTIVE) {
      await this.ticketService.markAsExpired(ticketId);
    }

    if (ticket.status === TicketStatusType.EXPIRED) {
      return {
        success: false,
        result: "Ticket expired",
      };
    }

    await this.ticketService.markAsUsed(ticket.id);

    return {
      success: true,
      result: "Ticket valid",
    };
  }
}
