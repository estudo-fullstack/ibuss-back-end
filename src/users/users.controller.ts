import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.findOne(id);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
    }
  }

  @Patch(":id")
  update(@Param("id", new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch("password/:id")
  updatePassword(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @Patch("deactivate/:id")
  deactivateUser(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.deactivateUser(id);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
    }
  }

  @Patch("suspend/:id")
  suspendUser(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.suspendUser(id);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
    }
  }
}
