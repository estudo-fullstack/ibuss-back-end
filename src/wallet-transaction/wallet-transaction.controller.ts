import { Controller, Get, Post, Req, Body, UseGuards } from "@nestjs/common";
import { WalletTransactionService } from "./wallet-transaction.service";
import type { Request } from "express";
import { DepositDto } from "./dto/deposit.dto";
import { WithdrawDto } from "./dto/withdraw.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserNotAuthenticatedException } from "./errors/wallet-transaction.error";

@UseGuards(JwtAuthGuard)
@Controller("wallet-transaction")
export class WalletTransactionController {
  constructor(private readonly walletTransactionService: WalletTransactionService) {}

  @Get("balance")
  async getBalance(@Req() req: Request) {
    const userId = req.user?.id ?? (req.headers["user-id"] as string);

    if (!userId) {
      throw new UserNotAuthenticatedException();
    }

    const balance = await this.walletTransactionService.getBalance(userId);
    return { balance: Number(balance.toFixed(2)) };
  }

  @Post("deposit")
  async deposit(@Req() req: Request, @Body() body: DepositDto) {
    const userId = req.user?.id ?? (req.headers["user-id"] as string);

    if (!userId) {
      throw new UserNotAuthenticatedException();
    }

    const transaction = await this.walletTransactionService.deposit(userId, body.amount);
    return transaction;
  }

  @Post("withdraw")
  async withdraw(@Req() req: Request, @Body() body: WithdrawDto) {
    const userId = req.user?.id ?? (req.headers["user-id"] as string);

    if (!userId) {
      throw new UserNotAuthenticatedException();
    }

    const transaction = await this.walletTransactionService.withdraw(userId, body.amount);
    return transaction;
  }
}
