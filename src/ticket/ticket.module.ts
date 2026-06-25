import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { WalletTransactionModule } from "src/wallet-transaction/wallet-transaction.module";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { TicketTokenService } from "./ticketToken.service";
import { TicketValidationService } from "./ticketValidation.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("TICKET_SECRET"),
        signOptions: {
          expiresIn: "31d",
        },
      }),
    }),
    WalletTransactionModule,
    AuthModule,
  ],
  controllers: [TicketController],
  providers: [TicketService, TicketTokenService, TicketValidationService],
})
export class TicketModule {}
