import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: passwordHash,
      },
      select: {
        name: true,
        email: true,
        phone_number: true,
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

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
          phone_number: true,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
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
          phone_number: true,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
