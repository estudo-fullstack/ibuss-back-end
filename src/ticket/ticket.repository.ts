import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TicketStatusType, TransactionType } from "src/generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";
import { PurchaseTicketDto } from "./dto/create-ticket.dto";
import { TicketNotFoundException } from "./errors/ticket.error";

@Injectable()
export class TicketRepository {
  constructor(private prismaService: PrismaService) {}

  async findManyByUserAndStatus(userId: string, status: TicketStatusType) {
    return this.prismaService.ticket.findMany({
      where: { userId, status },
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
            departureLocation: true,
            arrivalLocation: true,
            price: true,
          },
        },
      },
    });
  }

  async findOneByIdAndUser(userId: string, ticketId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);

    const ticket = await client.ticket.findUnique({
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
            departureLocation: true,
            arrivalLocation: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    return ticket;
  }

  async markAsUsed(ticketId: string) {
    try {
      return this.prismaService.ticket.update({
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
      return this.handlePrismaError(error);
    }
  }

  async updateStatus(ticketId: string, status: TicketStatusType, tx?: Prisma.TransactionClient) {
    try {
      const client = this.getClient(tx);

      return await client.ticket.update({
        where: { id: ticketId },
        data: { status: status },
        select: { id: true, status: true },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  async purchase(
    userId: string,
    purchaseData: PurchaseTicketDto,
    purchaseAt: Date,
    expiresAt: Date
  ) {
    try {
      return await this.prismaService.walletTransaction.create({
        data: {
          userId,
          transactionAmount: new Prisma.Decimal(purchaseData.purchasePrice),
          transactionType: TransactionType.WITHDRAWAL,
          ticket: {
            create: {
              userId,
              routeId: purchaseData.routeId,
              purchasePrice: new Prisma.Decimal(purchaseData.purchasePrice),
              purchaseAt,
              expiresAt,
            },
          },
        },
        select: {
          transactionAmount: true,
          ticket: {
            select: {
              id: true,
              status: true,
              expiresAt: true,
              route: {
                select: {
                  origin: true,
                  destination: true,
                  departureLocation: true,
                  arrivalLocation: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      return this.handlePrismaError(error);
    }
  }

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ?? this.prismaService;
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
