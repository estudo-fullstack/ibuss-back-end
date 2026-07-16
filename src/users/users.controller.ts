import { Controller, Get, Body, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { Request } from "express";

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
  @Patch("me/status/deactivate")
  deactivateUser(@Req() req: Request) {
    return this.usersService.deactivateUser(req.user!.id);
  }
}
