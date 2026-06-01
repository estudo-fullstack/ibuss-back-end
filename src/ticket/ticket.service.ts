import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { WalletTransactionService } from "src/wallet-transaction/wallet-transaction.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private walletTransactionService: WalletTransactionService,
  ) {}

  // findAll() {
  //   return `This action returns all ticket`;
  // }

  // findOne(id: string) {
  //   return `This action returns a #${id} ticket`;
  // }

  async purchase(userId: string, purchaseData: CreateTicketDto) {
    const balance = await this.walletTransactionService.getBalance(userId);

    if (balance < purchaseData.purchasePrice) {
      throw new BadRequestException("Saldo insuficiente");
    }

    return this.prisma.$transaction(async (tx) => {
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
          status: "CONFIRMED",
          purchaseAt: new Date(),
        },
      });
    });
  }
}
