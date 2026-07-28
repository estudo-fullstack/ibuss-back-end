import { Controller, Get, Body, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { Request } from "express";
import { UpdateUserAvatarDto } from "./dto/update-user-avatar.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @UseGuards(JwtAuthGuard)
  @Patch("me/avatar")
  updateAvatar(@Req() req: Request, @Body() updateUserAvatarDto: UpdateUserAvatarDto) {
    return this.usersService.updateAvatar(req.user!.id, updateUserAvatarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/status/deactivate")
  deactivateUser(@Req() req: Request) {
    return this.usersService.deactivateUser(req.user!.id);
  }
}
