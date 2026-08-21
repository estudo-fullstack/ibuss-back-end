import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, TransactionType } from "../generated/prisma/client";
import { ExtractQueryDto } from "./dto/extract-query-dto";

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

  async deposit(userId: string, amount: Prisma.Decimal, tx?: Prisma.TransactionClient) {
    const client = this.getClient(tx);

    return client.walletTransaction.create({
      data: {
        userId,
        transactionAmount: amount,
        transactionType: TransactionType.DEPOSIT,
      },
      select: {
        transactionAmount: true,
        transactionType: true,
      },
    });
  }

  async getExtract(userId: string, queryDto?: ExtractQueryDto) {
    const transactions = await this.prismaService.walletTransaction.findMany({
      where: {
        userId,
        ...(queryDto?.type && { transactionType: queryDto.type }),
        ...(queryDto?.timePeriodInDays && {
          createdAt: {
            gte: new Date(Date.now() - queryDto.timePeriodInDays * 24 * 60 * 60 * 1000),
          },
        }),
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
