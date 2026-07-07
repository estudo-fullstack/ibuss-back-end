import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TicketStatusType, TransactionType } from "src/generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";
import { PurchaseTicketDto } from "./dto/create-ticket.dto";

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
            price: true,
          },
        },
      },
    });
  }

  async findOneByIdAndUser(userId: string, ticketId: string, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);

    return client.ticket.findUnique({
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

  async markAsUsed(ticketId: string) {
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
  }

  async updateStatus(ticketId: string, status: TicketStatusType, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);

    return await client.ticket.update({
      where: { id: ticketId },
      data: { status: status },
      select: { id: true, status: true },
    });
  }

  async purchase(
    userId: string,
    purchaseData: PurchaseTicketDto,
    purchaseAt: Date,
    expiresAt: Date
  ) {
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
              },
            },
          },
        },
      },
    });
  }

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ?? this.prismaService;
  }
}
