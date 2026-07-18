import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateById(id, updateUserDto);
  }

  async deactivateUser(id: string) {
    return this.usersRepository.deactivateById(id);
  }
}
