import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  findOne(@Req() req: Request) {
    return this.usersService.findOne(req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user!.id, updateUserDto);
  }

  @Patch("me/password/:id")
  updatePassword(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/status/deactivate")
  deactivateUser(@Req() req: Request) {
    return this.usersService.deactivateUser(req.user!.id);
  }
}
