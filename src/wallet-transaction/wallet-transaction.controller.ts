import { Controller, Get, Post, Req, Body, UseGuards, Query } from "@nestjs/common";
import { WalletTransactionService } from "./wallet-transaction.service";
import type { Request } from "express";
import { DepositDto } from "./dto/deposit.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserNotAuthenticatedException } from "./errors/wallet-transaction.error";
import { ExtractQueryDto } from "./dto/extract-query-dto";

@UseGuards(JwtAuthGuard)
@Controller("wallet")
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

  @Get("transactions")
  async getExtract(@Req() req: Request, @Query() { type }: ExtractQueryDto) {
    const userId = req.user!.id;
    return this.walletTransactionService.getExtract(userId, type);
  }
}
