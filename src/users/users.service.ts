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

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { phone_number: phoneNumber, ...rest } = updateUserDto;
      return await this.prismaService.user.update({
        data: {
          ...rest,
          ...(phoneNumber !== undefined ? { phoneNumber } : {}),
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
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
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
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
    }
  }

  async deactivateUser(id: string) {
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
  }

  async suspendUser(id: string) {
    return this.prismaService.user.update({
      data: {
        status: "SUSPENDED",
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
  }
}
