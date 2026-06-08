import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WalletTransactionService } from "src/wallet-transaction/wallet-transaction.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { Prisma, TicketStatusType } from "src/generated/prisma/client";

@Injectable()
export class TicketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletTransactionService: WalletTransactionService
  ) {}

  async findByUser(userId: string, status: TicketStatusType) {
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

  async findOne(id: string) {
    return this.prismaService.ticket.findUnique({
      where: { id },
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

  async purchase(userId: string, purchaseData: CreateTicketDto) {
    const balance = await this.walletTransactionService.getBalance(userId);

    if (balance < purchaseData.purchasePrice) {
      throw new BadRequestException("Saldo insuficiente");
    }

    return this.prismaService.$transaction(async (tx) => {
      const walletTransaction = await tx.walletTransaction.create({
        data: {
          userId,
          transactionAmount: new Prisma.Decimal(purchaseData.purchasePrice),
          transactionType: "WITHDRAWAL",
        },
      });

      return tx.ticket.create({
        data: {
          userId,
          routeId: purchaseData.routeId,
          walletTransactionId: walletTransaction.id,
          purchasePrice: new Prisma.Decimal(purchaseData.purchasePrice),
          purchaseAt: new Date(),
        },
        select: {
          status: true,
          purchaseAt: true,
        },
      });
    });
  }
}
