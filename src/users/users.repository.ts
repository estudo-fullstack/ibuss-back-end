import { Injectable } from "@nestjs/common";
import { Prisma, UserStatus } from "src/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserAlreadyExistsException, UserNotFoundException } from "./errors/users.error";

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
        avatarId: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await this.prismaService.user.update({
        data,
        where: { id },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          avatarId: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateAvatarById(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await this.prismaService.user.update({
        data,
        where: { id },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          avatarId: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deactivateById(id: string) {
    try {
      return await this.prismaService.user.update({
        data: { status: UserStatus.INACTIVE },
        where: { id },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
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
      case "P2002":
        throw new UserAlreadyExistsException();
      case "P2025":
        throw new UserNotFoundException();
      default:
        throw error;
    }
  }
}
