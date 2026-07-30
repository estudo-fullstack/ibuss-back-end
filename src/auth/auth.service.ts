import { Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {
  InvalidCredentialsException,
  UserInactiveException,
  UserSuspendedException,
} from "./errors/auth.error";
import { UserNotFoundException } from "../users/errors/users.error";

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return this.authRepository.create({
      ...createUserDto,
      password: passwordHash,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (user.status === "INACTIVE") {
      throw new UserInactiveException();
    }

    if (user.status === "SUSPENDED") {
      throw new UserSuspendedException();
    }

    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async changePassword(id: string, changeUserPasswordDto: ChangeUserPasswordDto) {
    const user = await this.authRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const passwordMatch = await bcrypt.compare(
      changeUserPasswordDto.currentPassword,
      user.password
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const passwordHash = await bcrypt.hash(changeUserPasswordDto.newPassword, 10);

    return this.authRepository.updatePasswordById(id, passwordHash);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    await this.authRepository.existsByEmail(forgotPasswordDto.email);

    return {
      message: "enviaremos instruções para redefinir sua senha",
    };
  }
}
