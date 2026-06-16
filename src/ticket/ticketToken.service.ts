import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TicketTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generate(ticketId: string) {
    return await this.jwtService.signAsync({ ticketId });
  }

  async verify(token: string): Promise<{
    ticketId: string;
  }> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
