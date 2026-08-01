import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";
import { PasswordResetTokenConflictException } from "src/auth/errors/auth.error";

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

  async getTokenHash(id: string) {
    try {
      return await this.prismaService.passwordResetToken.findUniqueOrThrow({
        where: { id },
        select: {
          tokenHash: true,
          expiresAt: true,
          usedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async markAsUsed(userId: string, tx: Prisma.TransactionClient) {
    try {
      return await tx.passwordResetToken.updateMany({
        where: {
          user: { id: userId },
        },
        data: {
          usedAt: new Date(),
        },
      });
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
        throw new BadRequestException("Unable to reset password!");
      case "P2003":
        throw new PasswordResetTokenConflictException();
      default:
        throw error;
    }
  }
}
