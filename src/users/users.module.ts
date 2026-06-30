import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { UsersController } from "./users.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
})
export class UsersModule {}
