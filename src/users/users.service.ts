import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";
import { UsersRepository } from "./users.repository";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserNotFoundException } from "./errors/users.error";

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private usersRepository: UsersRepository
  ) {}

  private isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
  }

  private isUniqueConstraintError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
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
