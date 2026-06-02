import { Module } from "@nestjs/common";
import { WalletTransactionService } from "./wallet-transaction.service";
import { WalletTransactionController } from "./wallet-transaction.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [WalletTransactionController],
  providers: [WalletTransactionService],
  exports: [WalletTransactionService],
})
export class WalletTransactionModule {}
