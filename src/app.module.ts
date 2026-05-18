import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { WalletTransactionModule } from "./wallet-transaction/wallet-transaction.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    WalletTransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
