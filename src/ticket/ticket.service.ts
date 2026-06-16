import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WalletTransactionService } from "src/wallet-transaction/wallet-transaction.service";
import { PurchaseTicketDto } from "./dto/create-ticket.dto";
import { Prisma, TicketStatusType } from "src/generated/prisma/client";
import { TicketNotFoundException } from "./errors/ticket.error";

@Injectable()
export class TicketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletTransactionService: WalletTransactionService
  ) {}

  async findManyByUserAndStatus(userId: string, status: TicketStatusType) {
    return this.prismaService.ticket.findMany({
      where: {
        userId,
        status,
      },
      select: {
        id: true,
        purchasePrice: true,
        status: true,
        purchaseAt: true,
        usedAt: true,
        route: {
          select: {
            routeNumber: true,
            origin: true,
            destination: true,
            price: true,
          },
        },
      },
    });
  }

  async findOne(userId: string, ticketId: string) {
    return await this.prismaService.ticket.findUnique({
      where: { id: ticketId, userId: userId },
      select: {
        id: true,
        purchasePrice: true,
        status: true,
        purchaseAt: true,
        usedAt: true,
        expiresAt: true,
        route: {
          select: {
            routeNumber: true,
            origin: true,
            destination: true,
          },
        },
      },
    });
  }

  async purchase(userId: string, purchaseData: PurchaseTicketDto) {
    const balance = await this.walletTransactionService.getBalance(userId);

    if (balance < purchaseData.purchasePrice) {
      throw new BadRequestException("Insufficient balance");
    }

    try {
      const purchaseAt = new Date();

      const expiresAt = new Date(purchaseAt);
      expiresAt.setDate(expiresAt.getDate() + 30);

      return await this.prismaService.walletTransaction.create({
        data: {
          userId,
          transactionAmount: new Prisma.Decimal(purchaseData.purchasePrice),
          transactionType: "WITHDRAWAL",
          ticket: {
            create: {
              userId: userId,
              routeId: purchaseData.routeId,
              purchasePrice: new Prisma.Decimal(purchaseData.purchasePrice),
              purchaseAt: purchaseAt,
              expiresAt: expiresAt,
            },
          },
        },
        select: {
          transactionAmount: true,
          ticket: {
            select: {
              status: true,
              expiresAt: true,
              route: {
                select: {
                  origin: true,
                  destination: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async markAsUsed(ticketId: string) {
    try {
      return await this.prismaService.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          status: TicketStatusType.USED,
          usedAt: new Date(),
        },
        select: {
          status: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async markAsCanceled(userId: string, ticketId: string) {
    // para cancelamento partindo do usuário logado
    try {
      return await this.prismaService.ticket.update({
        where: { id: ticketId, userId: userId },
        data: {
          status: TicketStatusType.CANCELED,
        },
        select: {
          status: true,
        },
      });
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

  async validateTicket(ticketId: string) {
    try {
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
