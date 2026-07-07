import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TicketRepository } from "./ticket.repository";
import { TicketTokenService } from "./ticketToken.service";
import { PurchaseTicketDto } from "./dto/create-ticket.dto";
import { Prisma, TicketStatusType } from "src/generated/prisma/client";
import { TicketNotFoundException } from "./errors/ticket.error";
import { TransactionType } from "src/generated/prisma/enums";
import { WalletRepository } from "src/wallet-transaction/wallet.repository";

@Injectable()
export class TicketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketRepository: TicketRepository,
    private readonly walletRepository: WalletRepository,
    private readonly ticketTokenService: TicketTokenService
  ) {}

  async findManyByUserAndStatus(userId: string, status: TicketStatusType) {
    return this.ticketRepository.findManyByUserAndStatus(userId, status);
  }

  async findOne(userId: string, ticketId: string) {
    return this.ticketRepository.findOneByIdAndUser(userId, ticketId);
  }

  async purchase(userId: string, purchaseData: PurchaseTicketDto) {
    const balance = await this.walletRepository.getBalance(userId);

    if (balance < purchaseData.purchasePrice) {
      throw new BadRequestException("Insufficient balance");
    }

    try {
      const purchaseAt = new Date();

      const expiresAt = new Date(purchaseAt);
      expiresAt.setDate(expiresAt.getDate() + 30);

      const purchasedTicket = await this.ticketRepository.purchase(
        userId,
        purchaseData,
        purchaseAt,
        expiresAt
      );
      const generatedTicketId = purchasedTicket.ticket!.id;

      const ticketToken = await this.ticketTokenService.generate(generatedTicketId);

      return {
        ticketToken: ticketToken,
        ticket: purchasedTicket,
      };
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async markAsUsed(ticketId: string) {
    try {
      return await this.ticketRepository.markAsUsed(ticketId);
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async markAsCanceled(userId: string, ticketId: string) {
    try {
      return this.prismaService.$transaction(async (tx) => {
        //find ticket
        const ticket = await this.ticketRepository.findOneByIdAndUser(userId, ticketId, tx);

        if (!ticket) {
          throw new TicketNotFoundException();
        }

        if (ticket.status !== TicketStatusType.ACTIVE) {
          throw new BadRequestException("Ticket cannot be canceled");
        }

        if (ticket.expiresAt < new Date()) {
          throw new BadRequestException("Ticket has already expired");
        }

        //check if ticket is eligible for refund
        const refundDeadline = new Date(ticket.purchaseAt);
        refundDeadline.setDate(refundDeadline.getDate() + 7);
        const shouldRefund = new Date() <= refundDeadline;

        //refund ticket
        if (shouldRefund) {
          await this.walletRepository.deposit(userId, ticket.purchasePrice, tx);
        }

        //update ticket status
        const updatedTicket = await this.ticketRepository.updateStatus(
          ticketId,
          TicketStatusType.CANCELED,
          tx
        );

        return {
          ticket: updatedTicket,
          refunded: shouldRefund,
        };
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof TicketNotFoundException) {
        throw error;
      }
      return this.handlePrismaError(error);
    }
  }

  async markAsExpired(ticketId: string) {
    try {
      return await this.ticketRepository.updateStatus(ticketId, TicketStatusType.EXPIRED);
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
