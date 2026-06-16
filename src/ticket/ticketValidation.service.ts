import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, TicketStatusType } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { TicketTokenService } from "./ticketToken.service";
import { TicketNotFoundException } from "./errors/ticket.error";

@Injectable()
export class TicketValidationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketToken: TicketTokenService
  ) {}
  async validateTicket(token: string) {
    try {
      const validatedTicketToken = await this.ticketToken.verify(token);

      const ticketId = validatedTicketToken.ticketId;

      const ticket = await this.prismaService.ticket.findUniqueOrThrow({
        where: {
          id: ticketId,
        },
        select: {
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
        await this.markAsExpired(ticketId);
      }

      if (ticket.status === TicketStatusType.EXPIRED) {
        return {
          success: false,
          result: "Ticket expired",
        };
      }

      return {
        success: true,
        result: "Ticket valid",
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async markAsExpired(ticketId: string) {
    try {
      return await this.prismaService.ticket.update({
        where: { id: ticketId },
        data: {
          status: TicketStatusType.EXPIRED,
        },
        select: {
          status: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
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
