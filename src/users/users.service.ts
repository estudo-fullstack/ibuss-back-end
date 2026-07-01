import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { UsersRepository } from "./users.repository";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });
  }

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateById(id, updateUserDto);
  }

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    const passwordHash = await bcrypt.hash(updateUserPasswordDto.password, 10);

    return this.usersRepository.updatePasswordById(id, passwordHash);
  }

  async deactivateUser(id: string) {
    return this.usersRepository.deactivateById(id);
  }
}
