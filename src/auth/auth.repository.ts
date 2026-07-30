import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserAlreadyExistsException, UserNotFoundException } from "../users/errors/users.error";

@Injectable()
export class AuthRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({
        data,
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

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        password: true,
        avatarId: true,
      },
    });
  }

  async existsByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });

    return !!user;
  }

  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    });
  }

  async updatePasswordById(id: string, passwordHash: string) {
    try {
      return await this.prismaService.user.update({
        data: { password: passwordHash },
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
