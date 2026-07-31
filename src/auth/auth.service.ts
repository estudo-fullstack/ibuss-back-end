import { Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { buildPasswordResetLink, generatePasswordResetToken } from "src/email/password-reset-token";
import {
  InvalidCredentialsException,
  UserInactiveException,
  UserSuspendedException,
} from "./errors/auth.error";
import { UserNotFoundException } from "../users/errors/users.error";
import { PasswordResetTokenRepository } from "./passwordResetToken.repository";
import sendPasswordResetEmail from "src/email/resend";

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private passwordResetTokenRepository: PasswordResetTokenRepository
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
    const user = await this.authRepository.existsByEmail(forgotPasswordDto.email);

    if (!user) {
      return {
        message: "enviaremos instruções para redefinir sua senha",
      };
    }

    // gerar token e tokenhash
    const passwordResetToken = generatePasswordResetToken();

    // montagem do link para ser enviado no email
    const forgotPasswordLink = buildPasswordResetLink(passwordResetToken.token);

    // tempo de validade do token
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const data = {
      userId: user.id,
      tokenHash: passwordResetToken.tokenHash,
      expiresAt: expiresAt,
    };

    await this.passwordResetTokenRepository.saveToken(data);

    await sendPasswordResetEmail(forgotPasswordDto.email, forgotPasswordLink);

    return {
      message: "enviaremos instruções para redefinir sua senha",
    };
  }
}
