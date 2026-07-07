import { Module } from "@nestjs/common";
import { WalletTransactionService } from "./wallet-transaction.service";
import { WalletTransactionController } from "./wallet-transaction.controller";
import { AuthModule } from "src/auth/auth.module";
import { WalletRepository } from "./wallet.repository";

@Module({
  imports: [AuthModule],
  controllers: [WalletTransactionController],
  providers: [WalletTransactionService, WalletRepository],
  exports: [WalletTransactionService],
})
export class WalletTransactionModule {}
