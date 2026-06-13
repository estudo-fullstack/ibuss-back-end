import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { WalletTransactionModule } from "src/wallet-transaction/wallet-transaction.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [WalletTransactionModule, AuthModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
