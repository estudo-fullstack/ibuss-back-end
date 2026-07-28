import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserAvatarDto } from "./dto/update-user-avatar.dto";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updateAvatar(id: string, updateUserAvatarDto: UpdateUserAvatarDto) {
    return this.usersRepository.updateAvatarById(id, updateUserAvatarDto);
  }

  async deactivateUser(id: string) {
    return this.usersRepository.deactivateById(id);
  }
}
