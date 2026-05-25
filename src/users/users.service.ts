import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import bcrypt from "bcrypt";

function isPrismaError(error: unknown): error is { code?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  // Posteriormente esses métodos serão extraídos para uma classe separada para ser mais reutilizavel
  private isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
  }

  private isUniqueConstraintError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const { phoneNumber: phoneNumber, ...rest } = createUserDto;

    return this.prismaService.user.create({
      data: {
        ...rest,
        password: passwordHash,
        phoneNumber,
      },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        data: {
          ...updateUserDto,
        },
        where: {
          id: id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      });
    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new UserNotFoundException();
      }

      throw error;
    }
  }

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    try {
      const passwordHash = await bcrypt.hash(updateUserPasswordDto.password, 10);
      return this.prismaService.user.update({
        data: {
          password: passwordHash,
        },
        where: {
          id: id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      });
    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new UserNotFoundException();
      }

      throw error;
    }
  }

  async deactivateUser(id: string) {
    try {
      return this.prismaService.user.update({
        data: {
          status: "INACTIVE",
        },
        where: {
          id: id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      });
    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new UserNotFoundException();
      }

      throw error;
    }
  }
}
