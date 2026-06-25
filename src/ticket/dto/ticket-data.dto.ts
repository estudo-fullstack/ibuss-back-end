import { IsString, IsUUID } from "class-validator";

export class TicketDataDto {
  @IsString()
  token!: string;

  @IsUUID()
  routeId!: string;
}
