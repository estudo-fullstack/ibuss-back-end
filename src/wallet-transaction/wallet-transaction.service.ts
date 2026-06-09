import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";

@Injectable()
export class WalletTransactionService {
  constructor(private prismaService: PrismaService) {}

  async getBalance(userId: string) {
    const deposits = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: "DEPOSIT",
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const withdrawals = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: "WITHDRAWAL",
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const totalDeposits = Number(deposits._sum.transactionAmount ?? 0);
    const totalWithdrawals = Number(withdrawals._sum.transactionAmount ?? 0);
    return totalDeposits - totalWithdrawals;
  }

  async deposit(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException("Deposit amount must be greater than zero");
    }

    return this.prismaService.walletTransaction.create({
      data: {
        userId,
        transactionAmount: new Prisma.Decimal(amount),
        transactionType: "DEPOSIT",
      },
    });
  }

  // async withdraw(userId: string, amount: number) {
  //   if (amount <= 0) {
  //     throw new BadRequestException("Withdrawal amount must be greater than zero");
  //   }

  //   const balance = await this.getBalance(userId);
  //   if (balance < amount) {
  //     throw new BadRequestException("Insufficient balance");
  //   }

  //   return this.prismaService.walletTransaction.create({
  //     data: {
  //       userId,
  //       transactionAmount: new Prisma.Decimal(amount),
  //       transactionType: "WITHDRAWAL",
  //     },
  //   });
  // }
}
