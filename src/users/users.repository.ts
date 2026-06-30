import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserAlreadyExistsException } from "./errors/users.error";

@Injectable()
export class UsersRepository {
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
      if (this.isUniqueConstraintError(error)) {
        throw new UserAlreadyExistsException();
      }
    }
  }

  private isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
  }

  private isUniqueConstraintError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }
}
