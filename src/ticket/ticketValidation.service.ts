import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, TicketStatusType } from "src/generated/prisma/client";
import { TicketService } from "./ticket.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TicketTokenService } from "./ticketToken.service";
import { TicketNotFoundException } from "./errors/ticket.error";
import { TicketDataDto } from "./dto/ticket-data.dto";

@Injectable()
export class TicketValidationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketToken: TicketTokenService,
    private readonly ticketService: TicketService
  ) {}
  async validateTicket(ticketData: TicketDataDto) {
    try {
      const { token, routeId } = ticketData;

      const validatedTicketToken = await this.ticketToken.verify(token);

      const ticketId = validatedTicketToken.ticketId;

      const ticket = await this.prismaService.ticket.findUniqueOrThrow({
        where: {
          id: ticketId,
          routeId: routeId,
        },
        select: {
          id: true,
          expiresAt: true,
          status: true,
        },
      });

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
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      throw error;
    }
    switch (error.code) {
      case "P2003":
        throw new BadRequestException("User or route not found");
      case "P2025":
        throw new TicketNotFoundException();
      default:
        throw error;
    }
  }
}
