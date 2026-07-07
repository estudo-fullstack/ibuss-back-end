import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TicketStatusType } from "src/generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";

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

  async findOneByIdAndUser(userId: string, ticketId: string) {
    return this.prismaService.ticket.findUnique({
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

  async findOneByIdAndUserWithTransaction(
    tx: Prisma.TransactionClient,
    userId: string,
    ticketId: string
  ) {
    return await tx.ticket.findUniqueOrThrow({
      where: { id: ticketId, userId },
      select: { purchasePrice: true, purchaseAt: true, status: true, expiresAt: true },
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

  async updateStatusWithTransaction(
    tx: Prisma.TransactionClient,
    ticketId: string,
    status: TicketStatusType
  ) {
    return tx.ticket.update({
      where: { id: ticketId },
      data: { status },
      select: { id: true, status: true },
    });
  }

  async updateStatus(ticketId: string, status: TicketStatusType) {
    return await this.prismaService.ticket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatusType.EXPIRED,
      },
      select: {
        status: true,
      },
    });
  }
}
