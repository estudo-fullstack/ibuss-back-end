import { Controller, Post, Body, Patch, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  changePassword(@Req() req: Request, @Body() changeUserPasswordDto: ChangeUserPasswordDto) {
    return this.authService.changePassword(req.user!.id, changeUserPasswordDto);
  }
}
