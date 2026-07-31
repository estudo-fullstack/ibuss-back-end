import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";
import { UserNotFoundException } from "src/users/errors/users.error";

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private prismaService: PrismaService) {}

  async saveToken(data: { userId: string; tokenHash: string; expiresAt: Date }) {
    try {
      const storedToken = await this.prismaService.passwordResetToken.create({
        data,
        select: {
          id: true,
          expiresAt: true,
        },
      });
      return storedToken;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      throw error;
    }

    switch (error.code) {
      case "P2025":
        throw new UserNotFoundException();
      default:
        throw error;
    }
  }
}
