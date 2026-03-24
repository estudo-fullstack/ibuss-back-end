import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
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
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
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
  }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
