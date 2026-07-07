import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, TransactionType } from "../generated/prisma/client";
import { Decimal } from "src/generated/prisma/internal/prismaNamespace";

@Injectable()
export class WalletRepository {
  constructor(private prismaService: PrismaService) {}

  async getBalance(userId: string) {
    const deposits = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: TransactionType.DEPOSIT,
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const withdrawals = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: TransactionType.WITHDRAWAL,
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const totalDeposits = Number(deposits._sum.transactionAmount ?? 0);
    const totalWithdrawals = Number(withdrawals._sum.transactionAmount ?? 0);
    return totalDeposits - totalWithdrawals;
  }

  async deposit(userId: string, amount: Decimal, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);

    return client.walletTransaction.create({
      data: {
        userId,
        transactionAmount: new Prisma.Decimal(amount),
        transactionType: TransactionType.DEPOSIT,
      },
      select: {
        transactionAmount: true,
        transactionType: true,
      },
    });
  }

  async getExtract(userId: string, type?: TransactionType) {
    const transactions = await this.prismaService.walletTransaction.findMany({
      where: {
        userId,
        ...(type && { transactionType: type }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: Number(transaction.transactionAmount),
      type: transaction.transactionType,
      createdAt: transaction.createdAt,
    }));
  }

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ?? this.prismaService;
  }
}
