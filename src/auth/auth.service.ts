import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {
  InvalidCredentialsException,
  UserInactiveException,
  UserSuspendedException,
} from "./errors/auth.error";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

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
}
