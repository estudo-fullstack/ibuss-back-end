import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { PasswordResetTokenRepository } from "./passwordResetToken.repository";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PasswordResetTokenRepository,
    PrismaService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
