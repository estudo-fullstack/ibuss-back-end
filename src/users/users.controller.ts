import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @Get("me/:id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password/:id")
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

  @UseGuards(JwtAuthGuard)
  @Patch("deactivate/:id")
  deactivateUser(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.deactivateUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("suspend/:id")
  suspendUser(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.suspendUser(id);
  @Patch("me/status/deactivate/:id")
  deactivateUser(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.deactivateUser(id);
  }
}