import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthRepository } from "./auth.repository";
import { PasswordResetTokenRepository } from "./passwordResetToken.repository";
import {
  buildPasswordResetLink,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "src/email/password-reset-token";
import { sendPasswordResetEmail, infoPasswordResetEmail } from "src/email/resend";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/forgot-password.dto";
import {
  InvalidCredentialsException,
  UserInactiveException,
  UserSuspendedException,
} from "./errors/auth.error";
import { UserNotFoundException } from "../users/errors/users.error";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
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
        message: "we will send instructions to reset your password",
      };
    }

    const passwordResetToken = generatePasswordResetToken();

    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const data = {
      userId: user.id,
      tokenHash: passwordResetToken.tokenHash,
      expiresAt: expiresAt,
    };

    const savedToken = await this.passwordResetTokenRepository.saveToken(data);

    const forgotPasswordLink = buildPasswordResetLink(passwordResetToken.token, savedToken.id);

    const emailData = {
      email: forgotPasswordDto.email,
      link: forgotPasswordLink,
    };

    await sendPasswordResetEmail(emailData);

    return {
      message: "we will send instructions to reset your password",
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const storedTokenHash = await this.passwordResetTokenRepository.getTokenHash(
      resetPasswordDto.id
    );
    if (storedTokenHash.user.status !== "ACTIVE") {
      throw new BadRequestException("Unable to reset password!");
    }
    const ferify = verifyPasswordResetToken(resetPasswordDto.token, storedTokenHash.tokenHash);

    if (!ferify || new Date() > storedTokenHash.expiresAt || storedTokenHash.usedAt) {
      throw new BadRequestException("Unable to reset password!");
    }

    const newPasswordHash = await bcrypt.hash(resetPasswordDto.password, 10);

    const processUpdate = this.prismaService.$transaction(async (tx) => {
      const updatedToken = await this.passwordResetTokenRepository.markAsUsed(
        storedTokenHash.user.id,
        tx
      );

      if (updatedToken.count === 0) {
        throw new BadRequestException("Unable to reset password!");
      }

      const updated = await this.authRepository.updatePasswordById(
        storedTokenHash.user.id,
        newPasswordHash,
        tx
      );
      return updated;
    });

    await infoPasswordResetEmail(storedTokenHash.user.email);

    return { message: "Password updated successfully" };
  }
}
