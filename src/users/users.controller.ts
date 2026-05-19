import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("me/:id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch("me/:id")
  update(@Param("id", new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch("me/password/:id")
  updatePassword(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @Patch("me/status/deactivate/:id")
  deactivateUser(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.deactivateUser(id);
  }
}
